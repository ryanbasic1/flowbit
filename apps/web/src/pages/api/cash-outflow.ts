import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * API Route: /api/cash-outflow
 * Returns expected cash outflow grouped by due date periods
 * Query params: start, end (optional date filters)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 90); // Default to 90 days

    // Get unpaid invoices with upcoming due dates
    const invoices = await prisma.invoice.findMany({
      where: {
        status: {
          not: "paid",
        },
        dueDate: {
          gte: now,
          lte: endDate,
        },
      },
      select: {
        dueDate: true,
        totalAmount: true,
      },
    });

    // Group into periods: 0-7 days, 8-30 days, 31-60 days, 60+ days
    const periods = {
      "0-7 days": { expectedOutflow: 0, invoiceCount: 0 },
      "8-30 days": { expectedOutflow: 0, invoiceCount: 0 },
      "31-60 days": { expectedOutflow: 0, invoiceCount: 0 },
      "60+ days": { expectedOutflow: 0, invoiceCount: 0 },
    };

    invoices.forEach((invoice) => {
      const daysUntilDue = Math.ceil(
        (new Date(invoice.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      let period: keyof typeof periods;
      if (daysUntilDue <= 7) {
        period = "0-7 days";
      } else if (daysUntilDue <= 30) {
        period = "8-30 days";
      } else if (daysUntilDue <= 60) {
        period = "31-60 days";
      } else {
        period = "60+ days";
      }

      periods[period].expectedOutflow += invoice.totalAmount;
      periods[period].invoiceCount += 1;
    });

    // Convert to array format
    const result = Object.entries(periods).map(([period, data]) => ({
      period,
      expectedOutflow: data.expectedOutflow,
      invoiceCount: data.invoiceCount,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching cash outflow:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
