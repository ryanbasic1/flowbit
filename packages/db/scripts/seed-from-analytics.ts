import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

/**
 * Transform Analytics_Test_Data.json into invoice data
 * The source file has complex nested structure from AI/OCR invoice processing
 */

async function main() {
  console.log("🌱 Starting database seed from Analytics_Test_Data.json...");

  const dataPath = path.join(process.cwd(), "../../data/Analytics_Test_Data.json");

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Data file not found at: ${dataPath}`);
    process.exit(1);
  }

  const rawData: any[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`📦 Found ${rawData.length} invoice documents to process`);

  // Create a default customer
  const customer = await prisma.customer.upsert({
    where: { id: "default-customer" },
    update: {},
    create: {
      id: "default-customer",
      name: "Your Company GmbH",
      email: "billing@yourcompany.de",
      phone: "+49-30-123456",
      address: "Business Street 1, 10115 Berlin, Germany",
    },
  });

  const vendorMap = new Map<string, string>();
  let vendorCount = 0;
  let invoiceCount = 0;
  let lineItemCount = 0;
  let skippedCount = 0;

  const categories = [
    "Operations",
    "Marketing",
    "Facilities",
    "IT Services",
    "Consulting",
    "Supplies",
  ];
  const statuses = ["paid", "pending", "overdue"];

  for (let i = 0; i < Math.min(rawData.length, 100); i++) {
    const item = rawData[i];

    try {
      // Extract data from the complex nested structure
      const extractedData = item.extractedData?.llmData;
      if (!extractedData) {
        skippedCount++;
        continue;
      }

      const invoiceData = extractedData.invoice?.value;
      const vendorData = extractedData.vendor?.value;
      const amountData = extractedData.amount?.value;
      const paymentData = extractedData.payment?.value;

      // Get invoice number
      const invoiceNumber =
        invoiceData?.invoiceId?.value ||
        invoiceData?.invoiceNumber?.value ||
        `INV-${Date.now()}-${i}`;

      // Get vendor name
      const vendorName =
        vendorData?.vendorName?.value || vendorData?.name?.value || `Vendor ${i + 1}`;

      // Get or create vendor
      let vendorId = vendorMap.get(vendorName);
      if (!vendorId) {
        const existingVendor = await prisma.vendor.findFirst({
          where: { name: vendorName },
        });

        if (existingVendor) {
          vendorId = existingVendor.id;
        } else {
          const vendor = await prisma.vendor.create({
            data: {
              name: vendorName,
              email: vendorData?.email?.value || vendorData?.vendorEmail?.value,
              phone: vendorData?.phone?.value || vendorData?.vendorPhone?.value,
              address: vendorData?.vendorAddress?.value || vendorData?.address?.value,
            },
          });
          vendorId = vendor.id;
          vendorCount++;
        }
        vendorMap.set(vendorName, vendorId);
      }

      // Get dates
      const invoiceDate = parseDate(invoiceData?.invoiceDate?.value) || new Date();
      const dueDate =
        parseDate(paymentData?.dueDate?.value) ||
        new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

      // Get amount
      const totalAmount = parseAmount(
        amountData?.totalAmount?.value ||
          amountData?.total?.value ||
          amountData?.grandTotal?.value ||
          Math.random() * 50000 + 1000
      );

      // Random status weighted towards paid
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const status =
        dueDate < new Date() ? (Math.random() > 0.3 ? "paid" : "overdue") : randomStatus;

      // Random category
      const category = categories[Math.floor(Math.random() * categories.length)];

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: String(invoiceNumber),
          vendorId,
          customerId: customer.id,
          date: invoiceDate,
          dueDate,
          totalAmount,
          status,
          category,
          notes: `Original file: ${item.name || "N/A"}`,
        },
      });
      invoiceCount++;

      // Create line items if we have them
      const lineItems = extractedData.lineItems?.value || [];
      if (Array.isArray(lineItems) && lineItems.length > 0) {
        for (const lineItem of lineItems.slice(0, 5)) {
          // Max 5 items
          const description =
            lineItem.description?.value || lineItem.itemDescription?.value || "Service/Product";
          const quantity = parseFloat(lineItem.quantity?.value || 1);
          const unitPrice = parseAmount(
            lineItem.unitPrice?.value || lineItem.price?.value || totalAmount / lineItems.length
          );
          const amount = parseAmount(
            lineItem.totalPrice?.value || lineItem.amount?.value || quantity * unitPrice
          );

          await prisma.lineItem.create({
            data: {
              invoiceId: invoice.id,
              description,
              quantity,
              unitPrice,
              amount,
              category,
            },
          });
          lineItemCount++;
        }
      } else {
        // Create a default line item
        await prisma.lineItem.create({
          data: {
            invoiceId: invoice.id,
            description: `${category} Services`,
            quantity: 1,
            unitPrice: totalAmount,
            amount: totalAmount,
            category,
          },
        });
        lineItemCount++;
      }

      // Create payment if status is paid
      if (status === "paid") {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amount: totalAmount,
            paymentDate: new Date(Math.min(dueDate.getTime(), Date.now())),
            method: "bank_transfer",
            reference: `PAY-${invoiceNumber}`,
          },
        });
      }

      if ((i + 1) % 10 === 0) {
        console.log(`   ✓ Processed ${i + 1} invoices...`);
      }
    } catch (error) {
      console.error(
        `⚠️  Error processing invoice #${i}:`,
        error instanceof Error ? error.message : error
      );
      skippedCount++;
    }
  }

  console.log("\n✅ Seed completed successfully!");
  console.log(`   📊 Vendors created: ${vendorCount}`);
  console.log(`   👥 Customers created: 1`);
  console.log(`   🧾 Invoices created: ${invoiceCount}`);
  console.log(`   📝 Line items created: ${lineItemCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
}

function parseDate(dateStr: any): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function parseAmount(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[€$,\s]/g, "").trim();
    const parsed = Number.parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return typeof value === "number" ? value : 0;
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
