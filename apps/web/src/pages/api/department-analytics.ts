import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * Department Analytics API
 * Returns spending and invoice count by department
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get all invoices with department information
    const invoices = await prisma.invoice.findMany({
      select: {
        departmentId: true,
        totalAmount: true,
        status: true,
        confidenceScore: true,
      },
    });

    // Group by department
    const departmentStats = new Map<
      string,
      {
        totalSpent: number;
        invoiceCount: number;
        avgConfidence: number;
        paidCount: number;
        pendingCount: number;
      }
    >();

    invoices.forEach((inv) => {
      const deptId = inv.departmentId || "unknown";
      const stats = departmentStats.get(deptId) || {
        totalSpent: 0,
        invoiceCount: 0,
        avgConfidence: 0,
        paidCount: 0,
        pendingCount: 0,
      };

      stats.totalSpent += inv.totalAmount;
      stats.invoiceCount += 1;
      stats.avgConfidence += inv.confidenceScore || 0;
      if (inv.status === "paid") stats.paidCount += 1;
      if (inv.status === "pending") stats.pendingCount += 1;

      departmentStats.set(deptId, stats);
    });

    // Format results
    const results = Array.from(departmentStats.entries()).map(
      ([departmentId, stats]) => ({
        departmentId,
        totalSpent: stats.totalSpent,
        invoiceCount: stats.invoiceCount,
        avgConfidence: stats.avgConfidence / stats.invoiceCount,
        paidCount: stats.paidCount,
        pendingCount: stats.pendingCount,
        paidPercentage: (stats.paidCount / stats.invoiceCount) * 100,
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error in department-analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
