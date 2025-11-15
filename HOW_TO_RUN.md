# 🚀 How to Run the Buchhaltung Invoice Analytics Dashboard

## ✅ Project Successfully Set Up!

Your invoice analytics dashboard is now ready to use with **11 invoices** from your `Analytics_Test_Data.json` dataset.

---

## 📊 What This Project Does

This is a **full-stack invoice analytics dashboard** that:

1. **Dashboard View** - Displays invoice analytics with charts and KPIs
   - Total spend (YTD), invoice count, average invoice value
   - Line charts for invoice trends over time
   - Bar charts for top vendors by spend
   - Donut charts for category-wise spending
   - Cash outflow forecasts
   - Real-time invoices table

2. **Chat with Data** - Natural language SQL queries
   - Ask questions in plain English about your invoices
   - Get SQL queries and results instantly
   - No external LLM required (rule-based)

---

## 🎯 Current Status

✅ **Dependencies Installed** - All npm packages ready  
✅ **Database Created** - SQLite database at `packages/db/dev.db`  
✅ **Data Seeded** - 11 invoices from your Analytics_Test_Data.json  
✅ **Server Running** - Next.js dev server on http://localhost:3000

---

## 🌐 Access the Application

### Main Dashboard

**URL:** http://localhost:3000

Features:

- Overview cards with KPIs
- Interactive charts (Chart.js)
- Invoices table with search/filter
- Responsive design

### Chat with Data

**URL:** http://localhost:3000/chat

Try these queries:

- "Total spend in the last 90 days"
- "Top 5 vendors by spend"
- "Show overdue invoices"
- "How many invoices do we have?"
- "Spend by category"

---

## 🗄️ About Your Dataset

### Data Source

`c:\Users\Santosh Vishwakarma\Desktop\new\data\Analytics_Test_Data.json`

- **Original format**: Complex nested AI/OCR invoice extraction data
- **Total documents**: 50 invoice PDFs
- **Processed**: 11 unique invoices (39 had duplicate invoice numbers)
- **Vendors created**: 12 companies
- **Line items**: 11

### Data Transformation

The seed script (`packages/db/scripts/seed-from-analytics.ts`) extracts:

- Invoice numbers from `extractedData.llmData.invoice.value.invoiceId.value`
- Vendor names from `extractedData.llmData.vendor.value.vendorName.value`
- Amounts from `extractedData.llmData.amount.value`
- Dates from `extractedData.llmData.invoice.value.invoiceDate.value`

---

## 📁 Project Structure

```
new/
├── apps/web/                   # Next.js frontend
│   ├── src/app/               # Pages (dashboard, chat)
│   ├── src/components/        # React components
│   ├── src/pages/api/         # API routes
│   └── src/lib/               # Utilities
├── packages/db/               # Database package
│   ├── prisma/schema.prisma  # Database schema
│   ├── scripts/              # Seed scripts
│   └── dev.db                # SQLite database ← Your data
├── data/
│   └── Analytics_Test_Data.json  # Source data
└── services/vanna/           # Optional: Python FastAPI service
```

---

## 🔧 Development Commands

### Start the Application

```powershell
pnpm dev
```

Opens on http://localhost:3000

### Stop the Server

Press `Ctrl+C` in the terminal

### View Database

```powershell
pnpm --filter @buchhaltung/db studio
```

Opens Prisma Studio to browse your data

### Reseed Database

```powershell
# Reseed with your Analytics_Test_Data.json
pnpm --filter @buchhaltung/db seed:analytics
```

### Add More Data

To process more than 100 invoices, edit:
`packages/db/scripts/seed-from-analytics.ts` line 47:

```typescript
for (let i = 0; i < Math.min(rawData.length, 100); i++) {
//                                            ^^^ Change this number
```

---

## 🎨 Key Features

### Dashboard Components

| Component      | Description              | Data Source           |
| -------------- | ------------------------ | --------------------- |
| Overview Cards | KPIs (spend, count, avg) | `/api/stats`          |
| Line Chart     | Monthly trends           | `/api/invoice-trends` |
| Bar Chart      | Top vendors              | `/api/vendors-top10`  |
| Donut Chart    | Category breakdown       | `/api/category-spend` |
| Cash Outflow   | Payment forecasts        | `/api/cash-outflow`   |
| Invoices Table | Searchable list          | `/api/invoices`       |

### API Endpoints

All available at `http://localhost:3000/api/`

- `GET /api/stats` - Dashboard statistics
- `GET /api/invoice-trends` - Monthly trends
- `GET /api/vendors-top10` - Top vendors
- `GET /api/category-spend` - Category breakdown
- `GET /api/cash-outflow` - Payment forecasts
- `GET /api/invoices` - Invoice list
- `POST /api/chat-with-data` - Natural language queries

---

## 💡 Understanding Your Data

### Sample Invoice Structure

After transformation, each invoice has:

```typescript
{
  invoiceNumber: "1234",
  vendor: "Musterfirma Müller",
  customer: "Your Company GmbH",
  date: "2025-11-04",
  dueDate: "2025-12-04",
  totalAmount: 15234.50,
  status: "paid" | "pending" | "overdue",
  category: "Operations" | "Marketing" | "Facilities" | "IT Services"
}
```

### Categories

Randomly assigned from:

- Operations
- Marketing
- Facilities
- IT Services
- Consulting
- Supplies

### Statuses

- `paid` - Payment received
- `pending` - Awaiting payment
- `overdue` - Past due date

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001; pnpm dev
```

### Database Errors

```powershell
# Reset database
Remove-Item packages\db\dev.db
Remove-Item packages\db\prisma\migrations -Recurse

# Recreate
cd packages\db
npx prisma migrate dev --name init
cd ..\..
pnpm --filter @buchhaltung/db seed:analytics
```

### Missing Data

```powershell
# Check invoice count
pnpm --filter @buchhaltung/db studio
# Browse to "Invoice" table
```

---

## 🔮 Optional: Vanna AI Service (Not Required)

The project includes a Python FastAPI service for advanced NLP queries, but it's **not necessary** for basic operation. The Next.js `/api/chat-with-data` endpoint handles queries directly.

To run it (optional):

```powershell
cd services\vanna
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📊 Next Steps

1. **Explore the Dashboard** at http://localhost:3000
2. **Try Chat Queries** at http://localhost:3000/chat
3. **Browse Your Data** with `pnpm --filter @buchhaltung/db studio`
4. **Add More Invoices** by modifying the seed script limit
5. **Customize** the UI/charts as needed

---

## 🎯 Summary

✅ Your `Analytics_Test_Data.json` is now being used to display invoice analytics  
✅ 11 invoices with 12 vendors are in the database  
✅ Dashboard is live at http://localhost:3000  
✅ All charts and tables are populated with your data

**Enjoy your invoice analytics dashboard!** 🎉
