import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * API Route: /api/chat-with-data
 * Simple rule-based natural language to SQL converter
 * POST body: { query: string }
 */

function generateSqlFromQuery(query: string): { sql: string; explanation: string } {
  const q = query.toLowerCase();

  // Total spend patterns
  if (q.includes("total spend") || q.includes("total amount")) {
    if (q.includes("90 days") || q.includes("last 90")) {
      return {
        sql: "SELECT SUM(totalAmount) as totalSpend FROM Invoice WHERE date >= datetime('now', '-90 days')",
        explanation: "Calculating total spend from invoices in the last 90 days",
      };
    }
    if (q.includes("30 days") || q.includes("last 30")) {
      return {
        sql: "SELECT SUM(totalAmount) as totalSpend FROM Invoice WHERE date >= datetime('now', '-30 days')",
        explanation: "Calculating total spend from invoices in the last 30 days",
      };
    }
    return {
      sql: "SELECT SUM(totalAmount) as totalSpend FROM Invoice",
      explanation: "Calculating total spend from all invoices",
    };
  }

  // Top vendors
  if (q.includes("top") && (q.includes("vendor") || q.includes("supplier"))) {
    const limit = q.match(/top (\d+)/)?.[1] || "10";
    return {
      sql: `SELECT v.name as vendor, SUM(i.totalAmount) as totalSpend, COUNT(*) as invoiceCount 
            FROM Invoice i 
            JOIN Vendor v ON i.vendorId = v.id 
            GROUP BY v.id, v.name 
            ORDER BY totalSpend DESC 
            LIMIT ${limit}`,
      explanation: `Finding the top ${limit} vendors by total spend`,
    };
  }

  // Overdue invoices
  if (q.includes("overdue")) {
    return {
      sql: "SELECT invoiceNumber, v.name as vendor, totalAmount, dueDate FROM Invoice i JOIN Vendor v ON i.vendorId = v.id WHERE status = 'overdue' ORDER BY dueDate",
      explanation: "Finding all overdue invoices",
    };
  }

  // Pending invoices
  if (q.includes("pending")) {
    return {
      sql: "SELECT invoiceNumber, v.name as vendor, totalAmount, dueDate FROM Invoice i JOIN Vendor v ON i.vendorId = v.id WHERE status = 'pending' ORDER BY dueDate",
      explanation: "Finding all pending invoices",
    };
  }

  // Invoice count
  if (q.includes("how many invoice") || q.includes("count") || q.includes("number of invoice")) {
    return {
      sql: "SELECT COUNT(*) as totalInvoices FROM Invoice",
      explanation: "Counting total number of invoices",
    };
  }

  // Category spending
  if (q.includes("category") || q.includes("categories")) {
    return {
      sql: "SELECT category, SUM(totalAmount) as totalSpend, COUNT(*) as invoiceCount FROM Invoice WHERE category IS NOT NULL GROUP BY category ORDER BY totalSpend DESC",
      explanation: "Breaking down spending by category",
    };
  }

  // Department spending
  if (q.includes("department") && (q.includes("spend") || q.includes("cost") || q.includes("analytics"))) {
    return {
      sql: "SELECT departmentId, SUM(totalAmount) as totalSpend, COUNT(*) as invoiceCount, AVG(confidenceScore) as avgConfidence FROM Invoice WHERE departmentId IS NOT NULL GROUP BY departmentId ORDER BY totalSpend DESC",
      explanation: "Breaking down spending by department with confidence scores",
    };
  }

  // Confidence analysis
  if (q.includes("confidence") || q.includes("accuracy") || q.includes("validation")) {
    if (q.includes("low") || q.includes("review") || q.includes("check")) {
      return {
        sql: "SELECT invoiceNumber, v.name as vendor, totalAmount, confidenceScore, isValidatedByHuman FROM Invoice i JOIN Vendor v ON i.vendorId = v.id WHERE confidenceScore < 0.7 ORDER BY confidenceScore ASC LIMIT 20",
        explanation: "Finding invoices with low confidence scores that need review",
      };
    }
    return {
      sql: "SELECT AVG(confidenceScore) as avgConfidence, MIN(confidenceScore) as minConfidence, MAX(confidenceScore) as maxConfidence, COUNT(CASE WHEN confidenceScore < 0.7 THEN 1 END) as lowConfCount FROM Invoice WHERE confidenceScore IS NOT NULL",
      explanation: "Analyzing AI extraction confidence scores across all invoices",
    };
  }

  // File/document queries
  if (q.includes("file") || q.includes("document") || q.includes("pdf")) {
    return {
      sql: "SELECT fileName, filePath, v.name as vendor, totalAmount, templateName FROM Invoice i JOIN Vendor v ON i.vendorId = v.id WHERE filePath IS NOT NULL ORDER BY date DESC LIMIT 20",
      explanation: "Finding invoice documents with file information",
    };
  }

  // Organization analysis
  if (q.includes("organization") && q.includes("spend")) {
    return {
      sql: "SELECT organizationId, SUM(totalAmount) as totalSpend, COUNT(*) as invoiceCount FROM Invoice WHERE organizationId IS NOT NULL GROUP BY organizationId ORDER BY totalSpend DESC",
      explanation: "Breaking down spending by organization",
    };
  }

  // Human validated
  if (q.includes("validated") || q.includes("verified") || q.includes("human")) {
    return {
      sql: "SELECT invoiceNumber, v.name as vendor, totalAmount, confidenceScore, isValidatedByHuman FROM Invoice i JOIN Vendor v ON i.vendorId = v.id WHERE isValidatedByHuman = 1 ORDER BY date DESC",
      explanation: "Finding invoices that have been validated by humans",
    };
  }

  // Tax analysis
  if (q.includes("tax") || q.includes("vat")) {
    return {
      sql: "SELECT SUM(taxAmount) as totalTax, SUM(totalAmount) as totalWithTax, SUM(netAmount) as totalNet FROM Invoice WHERE taxAmount IS NOT NULL",
      explanation: "Analyzing tax amounts across all invoices",
    };
  }

  // Average invoice
  if (q.includes("average") || q.includes("avg")) {
    return {
      sql: "SELECT AVG(totalAmount) as averageInvoice FROM Invoice",
      explanation: "Calculating average invoice amount",
    };
  }

  // Cash outflow / due soon
  if (q.includes("cash outflow") || q.includes("due") || q.includes("next 30")) {
    return {
      sql: "SELECT invoiceNumber, v.name as vendor, totalAmount, dueDate FROM Invoice i JOIN Vendor v ON i.vendorId = v.id WHERE status != 'paid' AND dueDate >= datetime('now') AND dueDate <= datetime('now', '+30 days') ORDER BY dueDate",
      explanation: "Finding invoices due in the next 30 days",
    };
  }

  // Paid invoices
  if (q.includes("paid")) {
    return {
      sql: "SELECT invoiceNumber, v.name as vendor, totalAmount, date FROM Invoice i JOIN Vendor v ON i.vendorId = v.id WHERE status = 'paid' ORDER BY date DESC",
      explanation: "Finding all paid invoices",
    };
  }

  // Recent invoices
  if (q.includes("recent") || q.includes("latest")) {
    return {
      sql: "SELECT invoiceNumber, v.name as vendor, totalAmount, date, status FROM Invoice i JOIN Vendor v ON i.vendorId = v.id ORDER BY date DESC LIMIT 10",
      explanation: "Finding the 10 most recent invoices",
    };
  }

  // Default: show all invoices
  return {
    sql: "SELECT invoiceNumber, v.name as vendor, totalAmount, date, status FROM Invoice i JOIN Vendor v ON i.vendorId = v.id ORDER BY date DESC LIMIT 20",
    explanation:
      "Showing recent invoices (try asking about: total spend, top vendors, overdue invoices, or spending by category)",
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query is required and must be a string" });
    }

    // Generate SQL from natural language
    const { sql, explanation } = generateSqlFromQuery(query);

    // Execute the query using Prisma's raw query
    const rawResults = await prisma.$queryRawUnsafe(sql);

    // Convert BigInt to Number for JSON serialization
    const results = JSON.parse(
      JSON.stringify(rawResults, (key, value) =>
        typeof value === "bigint" ? Number(value) : value
      )
    );

    return res.status(200).json({
      sql,
      results,
      explanation,
    });
  } catch (error) {
    console.error("Error in chat-with-data:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
