import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * API Route: /api/stats
 * Returns overview statistics for the dashboard cards
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total spend YTD
    const totalSpendResult = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        date: {
          gte: startOfYear,
        },
      },
    });

    // Total invoices
    const totalInvoices = await prisma.invoice.count();

    // Documents uploaded (approximation - count invoices with line items)
    const documentsUploaded = await prisma.invoice.count({
      where: {
        lineItems: {
          some: {},
        },
      },
    });

    // Average invoice value
    const avgInvoiceResult = await prisma.invoice.aggregate({
      _avg: {
        totalAmount: true,
      },
    });

    // Monthly change - current month vs last month
    const currentMonthSpend = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        date: {
          gte: startOfCurrentMonth,
        },
      },
    });

    const lastMonthSpend = await prisma.invoice.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        date: {
          gte: lastMonth,
          lt: startOfCurrentMonth,
        },
      },
    });

    const currentMonthInvoices = await prisma.invoice.count({
      where: {
        date: {
          gte: startOfCurrentMonth,
        },
      },
    });

    const lastMonthInvoices = await prisma.invoice.count({
      where: {
        date: {
          gte: lastMonth,
          lt: startOfCurrentMonth,
        },
      },
    });

    // Calculate percentage changes
    const spendChange =
      lastMonthSpend._sum.totalAmount && lastMonthSpend._sum.totalAmount > 0
        ? ((currentMonthSpend._sum.totalAmount || 0) - lastMonthSpend._sum.totalAmount) /
          lastMonthSpend._sum.totalAmount *
          100
        : 0;

    const invoiceChange =
      lastMonthInvoices > 0
        ? ((currentMonthInvoices - lastMonthInvoices) / lastMonthInvoices) * 100
        : 0;

    const stats = {
      totalSpend: totalSpendResult._sum.totalAmount || 0,
      totalInvoices,
      documentsUploaded,
      avgInvoiceValue: avgInvoiceResult._avg.totalAmount || 0,
      monthlyChange: {
        spend: Math.round(spendChange * 10) / 10,
        invoices: Math.round(invoiceChange * 10) / 10,
      },
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
