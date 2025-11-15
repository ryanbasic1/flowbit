import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * API Route: /api/category-spend
 * Returns spending breakdown by category
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Group invoices by category
    const categoryData = await prisma.invoice.groupBy({
      by: ["category"],
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          totalAmount: "desc",
        },
      },
    });

    // Calculate total for percentage
    const total = categoryData.reduce((sum, cat) => sum + (cat._sum.totalAmount || 0), 0);

    // Format response
    const result = categoryData.map((cat) => ({
      category: cat.category || "Uncategorized",
      totalSpend: cat._sum.totalAmount || 0,
      invoiceCount: cat._count.id,
      percentage: total > 0 ? ((cat._sum.totalAmount || 0) / total) * 100 : 0,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching category spend:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
