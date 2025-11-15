import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * Confidence Analysis API
 * Analyze AI extraction confidence scores across invoices
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        invoiceNumber: true,
        confidenceScore: true,
        isValidatedByHuman: true,
        totalAmount: true,
        vendor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        confidenceScore: "asc",
      },
    });

    // Calculate statistics
    const scores = invoices
      .map((i) => i.confidenceScore || 0)
      .filter((s) => s > 0);

    const avgConfidence = scores.reduce((a, b) => a + b, 0) / scores.length;
    const lowConfidence = invoices.filter((i) => (i.confidenceScore || 0) < 0.7);
    const mediumConfidence = invoices.filter(
      (i) => (i.confidenceScore || 0) >= 0.7 && (i.confidenceScore || 0) < 0.9
    );
    const highConfidence = invoices.filter((i) => (i.confidenceScore || 0) >= 0.9);
    const humanValidated = invoices.filter((i) => i.isValidatedByHuman);

    res.status(200).json({
      summary: {
        totalInvoices: invoices.length,
        avgConfidence: avgConfidence.toFixed(3),
        lowConfidenceCount: lowConfidence.length,
        mediumConfidenceCount: mediumConfidence.length,
        highConfidenceCount: highConfidence.length,
        humanValidatedCount: humanValidated.length,
        humanValidationRate: (
          (humanValidated.length / invoices.length) *
          100
        ).toFixed(1),
      },
      distribution: {
        low: lowConfidence.length,
        medium: mediumConfidence.length,
        high: highConfidence.length,
      },
      needsReview: lowConfidence.slice(0, 10).map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        vendor: inv.vendor.name,
        amount: inv.totalAmount,
        confidence: inv.confidenceScore,
        validated: inv.isValidatedByHuman,
      })),
    });
  } catch (error) {
    console.error("Error in confidence-analysis:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
