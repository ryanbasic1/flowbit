# Vanna SQL Generator Service

A FastAPI service that converts natural language queries into SQL and executes them against the invoice database.

## Features

- Rule-based NL to SQL conversion (no external APIs required)
- Direct SQLite database queries
- CORS enabled for Next.js frontend
- Health check endpoints

## Supported Query Patterns

- "total spend in the last X days/months"
- "top N vendors"
- "overdue invoices"
- "cash outflow next X days"
- "how many invoices"
- "spend by category"
- "recent invoices"

## Setup

```bash
cd services/vanna
pip install -r requirements.txt
```

## Run

```bash
# From the root of the monorepo
pnpm vanna:dev

# Or directly with uvicorn
cd services/vanna
uvicorn main:app --reload --port 8000
```

## Environment Variables

- `DATABASE_PATH`: Path to SQLite database file (default: `./packages/db/dev.db`)

## Endpoints

- `GET /` - Service info
- `POST /generate-sql` - Convert natural language to SQL and execute
- `GET /health` - Health check with database status
