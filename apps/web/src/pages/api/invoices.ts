import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@buchhaltung/db";

/**
 * API Route: /api/invoices
 * Returns paginated, searchable, and sortable invoices list
 * Query params: search, status, limit, offset, sort, order
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      search = "",
      status = "",
      limit = "20",
      offset = "0",
      sort = "date",
      order = "desc",
    } = req.query;

    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);

    // Build where clause
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search as string, mode: "insensitive" } },
        { vendor: { name: { contains: search as string, mode: "insensitive" } } },
      ];
    }

    // Build order by
    const orderBy: any = {};
    if (sort === "vendor") {
      orderBy.vendor = { name: order };
    } else if (sort === "amount") {
      orderBy.totalAmount = order;
    } else {
      orderBy[sort as string] = order;
    }

    // Get total count
    const total = await prisma.invoice.count({ where });

    // Get paginated invoices
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        vendor: {
          select: {
            name: true,
          },
        },
      },
      orderBy,
      take: limitNum,
      skip: offsetNum,
    });

    // Format response
    const result = {
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        vendor: inv.vendor.name,
        date: inv.date.toISOString(),
        dueDate: inv.dueDate.toISOString(),
        amount: inv.totalAmount,
        status: inv.status,
        category: inv.category,
      })),
      total,
      page: Math.floor(offsetNum / limitNum) + 1,
      pageSize: limitNum,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
