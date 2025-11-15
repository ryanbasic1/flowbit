import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * File Metadata API
 * Returns invoice file information with download links
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { departmentId, organizationId } = req.query;

    const whereClause: any = {};
    if (departmentId) whereClause.departmentId = departmentId as string;
    if (organizationId) whereClause.organizationId = organizationId as string;

    const invoices = await prisma.invoice.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      select: {
        id: true,
        invoiceNumber: true,
        fileName: true,
        filePath: true,
        fileType: true,
        totalAmount: true,
        date: true,
        departmentId: true,
        organizationId: true,
        templateName: true,
        vendor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const files = invoices
      .filter((inv) => inv.filePath)
      .map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        fileName: inv.fileName,
        filePath: inv.filePath,
        fileType: inv.fileType,
        vendor: inv.vendor.name,
        amount: inv.totalAmount,
        date: inv.date,
        departmentId: inv.departmentId,
        organizationId: inv.organizationId,
        template: inv.templateName,
      }));

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    console.error("Error in file-metadata:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
