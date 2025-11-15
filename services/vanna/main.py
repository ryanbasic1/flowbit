"""
FastAPI service for natural language to SQL conversion
Rule-based implementation for deterministic query generation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import re
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

app = FastAPI(title="Vanna SQL Generator", version="1.0.0")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get database path from environment variable
DATABASE_PATH = os.getenv("DATABASE_PATH", "./packages/db/dev.db")


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    sql: str
    results: List[Dict[str, Any]]
    explanation: Optional[str] = None


def get_db_connection():
    """Create a connection to the SQLite database"""
    if not os.path.exists(DATABASE_PATH):
        raise HTTPException(
            status_code=500,
            detail=f"Database file not found at {DATABASE_PATH}. Please run migrations and seed first.",
        )
    
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn


def execute_query(sql: str) -> List[Dict[str, Any]]:
    """Execute a SQL query and return results as a list of dictionaries"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        
        # Convert rows to dictionaries
        columns = [description[0] for description in cursor.description]
        results = []
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        
        conn.close()
        return results
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


def generate_sql(query: str) -> tuple[str, str]:
    """
    Rule-based SQL generation from natural language query
    Returns (sql_query, explanation)
    """
    query_lower = query.lower().strip()
    
    # Pattern 1: Total spend in last X days/months
    spend_pattern = r"total spend.*?(?:last|past)\s+(\d+)\s+(day|days|month|months)"
    match = re.search(spend_pattern, query_lower)
    if match:
        value = int(match.group(1))
        unit = match.group(2)
        
        if "month" in unit:
            sql = f"""
            SELECT 
                ROUND(SUM(totalAmount), 2) as total_spend,
                COUNT(*) as invoice_count
            FROM Invoice 
            WHERE date(date) >= date('now', '-{value} month')
            """
            explanation = f"Calculating total spend from invoices in the last {value} month(s)"
        else:
            sql = f"""
            SELECT 
                ROUND(SUM(totalAmount), 2) as total_spend,
                COUNT(*) as invoice_count
            FROM Invoice 
            WHERE date(date) >= date('now', '-{value} day')
            """
            explanation = f"Calculating total spend from invoices in the last {value} day(s)"
        
        return sql.strip(), explanation
    
    # Pattern 2: Top N vendors
    top_vendors_pattern = r"top\s+(\d+)\s+vendor"
    match = re.search(top_vendors_pattern, query_lower)
    if match:
        limit = int(match.group(1))
        sql = f"""
        SELECT 
            v.name as vendor,
            ROUND(SUM(i.totalAmount), 2) as total_spend,
            COUNT(i.id) as invoice_count
        FROM Invoice i
        JOIN Vendor v ON i.vendorId = v.id
        GROUP BY v.id, v.name
        ORDER BY total_spend DESC
        LIMIT {limit}
        """
        explanation = f"Finding the top {limit} vendors by total spend"
        return sql.strip(), explanation
    
    # Pattern 3: Overdue invoices
    if "overdue" in query_lower:
        sql = """
        SELECT 
            i.invoiceNumber,
            v.name as vendor,
            i.dueDate,
            ROUND(i.totalAmount, 2) as amount,
            i.status,
            CAST(julianday('now') - julianday(i.dueDate) AS INTEGER) as days_overdue
        FROM Invoice i
        JOIN Vendor v ON i.vendorId = v.id
        WHERE date(i.dueDate) < date('now') 
            AND i.status != 'paid'
        ORDER BY i.dueDate ASC
        """
        explanation = "Finding all overdue unpaid invoices"
        return sql.strip(), explanation
    
    # Pattern 4: Cash outflow (next X days or forecast)
    cash_pattern = r"cash.*?(?:outflow|forecast).*?(?:next|upcoming)?\s*(\d+)?\s*(day|days)?"
    match = re.search(cash_pattern, query_lower)
    if "cash" in query_lower and ("outflow" in query_lower or "forecast" in query_lower):
        # Default to 30 days if not specified
        days = 30
        if match and match.group(1):
            days = int(match.group(1))
        
        sql = f"""
        SELECT 
            CASE 
                WHEN CAST(julianday(dueDate) - julianday('now') AS INTEGER) <= 7 THEN '0-7 days'
                WHEN CAST(julianday(dueDate) - julianday('now') AS INTEGER) <= 30 THEN '8-30 days'
                WHEN CAST(julianday(dueDate) - julianday('now') AS INTEGER) <= 60 THEN '31-60 days'
                ELSE '60+ days'
            END as period,
            ROUND(SUM(totalAmount), 2) as expected_outflow,
            COUNT(*) as invoice_count
        FROM Invoice
        WHERE status != 'paid'
            AND date(dueDate) >= date('now')
            AND date(dueDate) <= date('now', '+{days} day')
        GROUP BY period
        ORDER BY 
            CASE period
                WHEN '0-7 days' THEN 1
                WHEN '8-30 days' THEN 2
                WHEN '31-60 days' THEN 3
                ELSE 4
            END
        """
        explanation = f"Forecasting cash outflow for the next {days} days, grouped by period"
        return sql.strip(), explanation
    
    # Pattern 5: Invoice count or statistics
    if "how many" in query_lower or "count" in query_lower:
        if "invoice" in query_lower:
            sql = """
            SELECT 
                COUNT(*) as total_invoices,
                COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_invoices,
                COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_invoices,
                ROUND(SUM(totalAmount), 2) as total_amount
            FROM Invoice
            """
            explanation = "Counting invoices by status"
            return sql.strip(), explanation
    
    # Pattern 6: Spend by category
    if "category" in query_lower or "categories" in query_lower:
        sql = """
        SELECT 
            COALESCE(category, 'Uncategorized') as category,
            ROUND(SUM(totalAmount), 2) as total_spend,
            COUNT(*) as invoice_count
        FROM Invoice
        GROUP BY category
        ORDER BY total_spend DESC
        """
        explanation = "Breaking down spend by category"
        return sql.strip(), explanation
    
    # Pattern 7: Recent invoices
    if "recent" in query_lower or "latest" in query_lower:
        limit = 10
        limit_match = re.search(r"(\d+)", query_lower)
        if limit_match:
            limit = int(limit_match.group(1))
        
        sql = f"""
        SELECT 
            i.invoiceNumber,
            v.name as vendor,
            i.date,
            i.dueDate,
            ROUND(i.totalAmount, 2) as amount,
            i.status
        FROM Invoice i
        JOIN Vendor v ON i.vendorId = v.id
        ORDER BY i.date DESC
        LIMIT {limit}
        """
        explanation = f"Fetching the {limit} most recent invoices"
        return sql.strip(), explanation
    
    # Pattern 8: Specific vendor
    vendor_pattern = r"vendor\s+(?:named|called)?\s*['\"]?(\w+(?:\s+\w+)*)['\"]?"
    match = re.search(vendor_pattern, query_lower)
    if match and "vendor" in query_lower:
        vendor_name = match.group(1).strip()
        sql = f"""
        SELECT 
            i.invoiceNumber,
            i.date,
            i.dueDate,
            ROUND(i.totalAmount, 2) as amount,
            i.status,
            i.category
        FROM Invoice i
        JOIN Vendor v ON i.vendorId = v.id
        WHERE LOWER(v.name) LIKE '%{vendor_name}%'
        ORDER BY i.date DESC
        """
        explanation = f"Finding invoices for vendor matching '{vendor_name}'"
        return sql.strip(), explanation
    
    # Default fallback: Return summary statistics
    sql = """
    SELECT 
        'Total Invoices' as metric,
        COUNT(*) as value
    FROM Invoice
    UNION ALL
    SELECT 
        'Total Spend',
        ROUND(SUM(totalAmount), 2)
    FROM Invoice
    UNION ALL
    SELECT 
        'Average Invoice',
        ROUND(AVG(totalAmount), 2)
    FROM Invoice
    """
    explanation = "Providing general invoice statistics (query not recognized - showing summary)"
    
    return sql.strip(), explanation


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Vanna SQL Generator",
        "status": "running",
        "version": "1.0.0",
        "database": DATABASE_PATH,
        "database_exists": os.path.exists(DATABASE_PATH),
    }


@app.post("/generate-sql", response_model=QueryResponse)
async def generate_sql_endpoint(request: QueryRequest):
    """
    Generate SQL from natural language query and execute it
    
    This endpoint accepts a natural language query, converts it to SQL
    using rule-based patterns, executes the query, and returns both
    the SQL and the results.
    """
    if not request.query or len(request.query.strip()) == 0:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        # Generate SQL from natural language
        sql, explanation = generate_sql(request.query)
        
        # Execute the query
        results = execute_query(sql)
        
        return QueryResponse(
            sql=sql,
            results=results,
            explanation=explanation,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}",
        )


@app.get("/health")
async def health_check():
    """Detailed health check"""
    db_exists = os.path.exists(DATABASE_PATH)
    
    status = {
        "status": "healthy" if db_exists else "unhealthy",
        "database_path": DATABASE_PATH,
        "database_exists": db_exists,
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    if db_exists:
        try:
            # Try a simple query to verify database is accessible
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) as count FROM Invoice")
            result = cursor.fetchone()
            status["invoice_count"] = result[0]
            conn.close()
        except Exception as e:
            status["status"] = "unhealthy"
            status["error"] = str(e)
    
    return status


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
