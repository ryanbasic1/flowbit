import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

/**
 * Seed script for populating the database with sample data
 * Reads from data/Analytics_Test_Data.json and normalizes the data structure
 */

interface RawInvoiceData {
  invoice_number: string;
  vendor: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  invoice_date: string;
  due_date: string;
  total_amount: number | string;
  status: string;
  category?: string;
  line_items?: Array<{
    description: string;
    quantity: number | string;
    unit_price: number | string;
    amount: number | string;
    category?: string;
  }>;
  payments?: Array<{
    amount: number | string;
    payment_date: string;
    method?: string;
    reference?: string;
  }>;
  notes?: string;
}

/**
 * Safely parse a value to float
 */
function parseFloat(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    // Remove currency symbols and commas
    const cleaned = value.replace(/[€$,]/g, "").trim();
    const parsed = Number.parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Safely parse date string to Date object
 */
function parseDate(dateStr: string): Date {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Read the sample data file
  const dataPath = path.join(process.cwd(), "../../data/Analytics_Test_Data.json");

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Data file not found at: ${dataPath}`);
    console.log("Creating sample data file...");
    // Create sample data if file doesn't exist
    createSampleData(dataPath);
  }

  const rawData: RawInvoiceData[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`📦 Found ${rawData.length} invoices to import`);

  // Track created entities to avoid duplicates
  const vendorMap = new Map<string, string>();
  const customerMap = new Map<string, string>();

  let vendorCount = 0;
  let customerCount = 0;
  let invoiceCount = 0;
  let lineItemCount = 0;
  let paymentCount = 0;

  for (const item of rawData) {
    try {
      // Upsert vendor
      let vendorId = vendorMap.get(item.vendor.name);
      if (!vendorId) {
        // Check if vendor exists
        const existingVendor = await prisma.vendor.findFirst({
          where: { name: item.vendor.name },
        });

        if (existingVendor) {
          vendorId = existingVendor.id;
        } else {
          const vendor = await prisma.vendor.create({
            data: {
              name: item.vendor.name,
              email: item.vendor.email,
              phone: item.vendor.phone,
              address: item.vendor.address,
            },
          });
          vendorId = vendor.id;
          vendorCount++;
        }
        vendorMap.set(item.vendor.name, vendorId);
      }

      // Upsert customer
      let customerId = customerMap.get(item.customer.name);
      if (!customerId) {
        // Check if customer exists
        const existingCustomer = await prisma.customer.findFirst({
          where: { name: item.customer.name },
        });

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const customer = await prisma.customer.create({
            data: {
              name: item.customer.name,
              email: item.customer.email,
              phone: item.customer.phone,
              address: item.customer.address,
            },
          });
          customerId = customer.id;
          customerCount++;
        }
        customerMap.set(item.customer.name, customerId);
      }

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: item.invoice_number,
          vendorId,
          customerId,
          date: parseDate(item.invoice_date),
          dueDate: parseDate(item.due_date),
          totalAmount: parseFloat(item.total_amount),
          status: item.status.toLowerCase(),
          category: item.category,
          notes: item.notes,
        },
      });
      invoiceCount++;

      // Create line items if present
      if (item.line_items && item.line_items.length > 0) {
        for (const lineItem of item.line_items) {
          await prisma.lineItem.create({
            data: {
              invoiceId: invoice.id,
              description: lineItem.description,
              quantity: parseFloat(lineItem.quantity),
              unitPrice: parseFloat(lineItem.unit_price),
              amount: parseFloat(lineItem.amount),
              category: lineItem.category,
            },
          });
          lineItemCount++;
        }
      }

      // Create payments if present
      if (item.payments && item.payments.length > 0) {
        for (const payment of item.payments) {
          await prisma.payment.create({
            data: {
              invoiceId: invoice.id,
              amount: parseFloat(payment.amount),
              paymentDate: parseDate(payment.payment_date),
              method: payment.method,
              reference: payment.reference,
            },
          });
          paymentCount++;
        }
      }
    } catch (error) {
      console.error(`⚠️  Error processing invoice ${item.invoice_number}:`, error);
    }
  }

  console.log("\n✅ Seed completed successfully!");
  console.log(`   📊 Vendors created: ${vendorCount}`);
  console.log(`   👥 Customers created: ${customerCount}`);
  console.log(`   🧾 Invoices created: ${invoiceCount}`);
  console.log(`   📝 Line items created: ${lineItemCount}`);
  console.log(`   💰 Payments created: ${paymentCount}`);
}

/**
 * Create sample data file if it doesn't exist
 */
function createSampleData(dataPath: string) {
  const sampleData: RawInvoiceData[] = [
    {
      invoice_number: "INV-2025-001",
      vendor: {
        name: "Global Supply",
        email: "contact@globalsupply.com",
        phone: "+1-555-0100",
        address: "123 Supply St, NY 10001",
      },
      customer: {
        name: "Buchhaltung GmbH",
        email: "billing@buchhaltung.de",
        phone: "+49-30-12345",
        address: "456 Finance Ave, Berlin 10115",
      },
      invoice_date: "2025-01-15",
      due_date: "2025-02-15",
      total_amount: 8679.25,
      status: "pending",
      category: "Operations",
      line_items: [
        {
          description: "Office Supplies - Monthly Order",
          quantity: 50,
          unit_price: 25.5,
          amount: 1275.0,
          category: "Operations",
        },
        {
          description: "IT Equipment",
          quantity: 3,
          unit_price: 2468.08,
          amount: 7404.25,
          category: "Operations",
        },
      ],
      payments: [],
      notes: "Net 30 payment terms",
    },
    // Add more sample invoices covering different vendors, categories, and statuses
    {
      invoice_number: "INV-2025-002",
      vendor: {
        name: "Phonix GmbH",
        email: "billing@phonix.de",
        phone: "+49-89-98765",
      },
      customer: {
        name: "Buchhaltung GmbH",
        email: "billing@buchhaltung.de",
      },
      invoice_date: "2025-01-20",
      due_date: "2025-02-20",
      total_amount: 736784.0,
      status: "paid",
      category: "Operations",
      line_items: [
        {
          description: "Software Licenses - Annual",
          quantity: 100,
          unit_price: 7367.84,
          amount: 736784.0,
          category: "Operations",
        },
      ],
      payments: [
        {
          amount: 736784.0,
          payment_date: "2025-02-10",
          method: "bank_transfer",
          reference: "PAY-2025-002",
        },
      ],
    },
  ];

  // Ensure data directory exists
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(dataPath, JSON.stringify(sampleData, null, 2));
  console.log(`✅ Created sample data at ${dataPath}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
