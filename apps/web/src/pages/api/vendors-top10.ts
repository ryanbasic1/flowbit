import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * API Route: /api/vendors-top10
 * Returns the top 10 vendors by total spend
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get limit from query params (default 10)
    const limit = parseInt(req.query.limit as string) || 10;

    // Query to get vendors with their total spend
    const vendorsWithSpend = await prisma.invoice.groupBy({
      by: ["vendorId"],
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
      take: limit,
    });

    // Fetch vendor details
    const vendorIds = vendorsWithSpend.map((v) => v.vendorId);
    const vendors = await prisma.vendor.findMany({
      where: {
        id: {
          in: vendorIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map for quick lookup
    const vendorMap = new Map(vendors.map((v) => [v.id, v.name]));

    // Calculate total spend for percentage calculation
    const totalSpend = vendorsWithSpend.reduce(
      (sum, v) => sum + (v._sum.totalAmount || 0),
      0
    );

    // Combine data
    const result = vendorsWithSpend.map((v) => ({
      vendor: vendorMap.get(v.vendorId) || "Unknown",
      totalSpend: v._sum.totalAmount || 0,
      invoiceCount: v._count.id,
      percentage: totalSpend > 0 ? ((v._sum.totalAmount || 0) / totalSpend) * 100 : 0,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching top vendors:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
