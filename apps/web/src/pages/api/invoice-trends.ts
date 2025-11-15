import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * API Route: /api/invoice-trends
 * Returns monthly invoice count and total spend trends
 * Query params: months (default: 12)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const months = parseInt(req.query.months as string) || 12;

    // Get invoices from the last N months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const invoices = await prisma.invoice.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      select: {
        date: true,
        totalAmount: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Group by month
    const monthlyData = new Map<string, { count: number; total: number }>();

    invoices.forEach((invoice) => {
      const date = new Date(invoice.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { count: 0, total: 0 });
      }

      const data = monthlyData.get(monthKey)!;
      data.count += 1;
      data.total += invoice.totalAmount;
    });

    // Convert to array and ensure we have data for all months
    const result = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const data = monthlyData.get(monthKey) || { count: 0, total: 0 };
      result.push({
        month: monthKey,
        invoiceCount: data.count,
        totalSpend: data.total,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching invoice trends:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
