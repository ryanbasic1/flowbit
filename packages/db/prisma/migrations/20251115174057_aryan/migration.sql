-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN "partyNumber" TEXT;
ALTER TABLE "Vendor" ADD COLUMN "taxId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "deliveryDate" DATETIME,
    "totalAmount" REAL NOT NULL,
    "taxAmount" REAL,
    "netAmount" REAL,
    "status" TEXT NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "documentId" TEXT,
    "fileName" TEXT,
    "filePath" TEXT,
    "fileType" TEXT,
    "organizationId" TEXT,
    "departmentId" TEXT,
    "uploadedById" TEXT,
    "templateId" TEXT,
    "templateName" TEXT,
    "isValidatedByHuman" BOOLEAN NOT NULL DEFAULT false,
    "confidenceScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("category", "createdAt", "customerId", "date", "dueDate", "id", "invoiceNumber", "notes", "status", "totalAmount", "updatedAt", "vendorId") SELECT "category", "createdAt", "customerId", "date", "dueDate", "id", "invoiceNumber", "notes", "status", "totalAmount", "updatedAt", "vendorId" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
CREATE INDEX "Invoice_vendorId_idx" ON "Invoice"("vendorId");
CREATE INDEX "Invoice_customerId_idx" ON "Invoice"("customerId");
CREATE INDEX "Invoice_date_idx" ON "Invoice"("date");
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX "Invoice_departmentId_idx" ON "Invoice"("departmentId");
CREATE INDEX "Invoice_organizationId_idx" ON "Invoice"("organizationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
