# Buchhaltung - Invoice Analytics Dashboard

> **Full Stack Developer Internship Assignment**  
> A production-ready Turborepo monorepo implementing an invoice analytics dashboard with natural language SQL queries.

![Dashboard Preview](https://img.shields.io/badge/Stack-Next.js%20%7C%20TypeScript%20%7C%20Prisma%20%7C%20FastAPI-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Development](#development)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project recreates a Figma dashboard UI for invoice analytics with a complete full-stack implementation:

- **Frontend**: Next.js 14 (App Router) with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: SQLite (development) with easy PostgreSQL migration path
- **AI Service**: FastAPI-based natural language to SQL converter (rule-based, no external APIs)
- **Monorepo**: Turborepo for efficient builds and development

## ✨ Features

### Dashboard
- **Overview Cards**: Total spend (YTD), invoice count, documents uploaded, average invoice value
- **Interactive Charts**:
  - Line chart: Invoice volume & value trends over 12 months
  - Horizontal bar: Top 10 vendors by spend
  - Donut chart: Category-wise spend distribution
  - Bar chart: Cash outflow forecast by due date buckets
- **Invoices Table**: Real-time vendor invoice data
- **Responsive Design**: Mobile-first, matches Figma pixel-perfect

### Chat with Data
- Natural language query interface
- Rule-based SQL generation (no external LLM required)
- Live query execution and results display
- SQL query preview with syntax highlighting
- Example queries for quick testing

### Supported Queries
- "Total spend in the last 90 days"
- "Top 5 vendors by spend"
- "Show overdue invoices"
- "Cash outflow forecast for next 30 days"
- "How many invoices do we have?"
- "Spend by category"

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes
- **ORM**: Prisma 5
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Validation**: TypeScript + Zod (implicit)

### AI/NLP Service
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Query Engine**: Rule-based pattern matching
- **Database Access**: sqlite3 (stdlib)

### DevOps
- **Monorepo**: Turborepo
- **Package Manager**: pnpm 8+
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
buchhaltung-monorepo/
├── apps/
│   └── web/                    # Next.js application
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── page.tsx    # Dashboard page
│       │   │   ├── chat/
│       │   │   │   └── page.tsx # Chat with Data page
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   ├── components/     # React components
│       │   │   ├── ui/         # shadcn/ui components
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   ├── OverviewCard.tsx
│       │   │   ├── LineChart.tsx
│       │   │   ├── BarChartHorizontal.tsx
│       │   │   ├── DonutChart.tsx
│       │   │   ├── CashOutflowChart.tsx
│       │   │   └── InvoicesTable.tsx
│       │   ├── lib/            # Utilities
│       │   │   ├── api.ts      # API client
│       │   │   ├── format.ts   # Formatting helpers
│       │   │   ├── types.ts    # TypeScript types
│       │   │   └── utils.ts    # General utilities
│       │   └── pages/api/      # API routes
│       │       ├── stats.ts
│       │       ├── invoice-trends.ts
│       │       ├── vendors-top10.ts
│       │       ├── category-spend.ts
│       │       ├── cash-outflow.ts
│       │       ├── invoices.ts
│       │       └── chat-with-data.ts
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── package.json
├── packages/
│   └── db/                     # Database package
│       ├── prisma/
│       │   └── schema.prisma   # Prisma schema
│       ├── scripts/
│       │   └── seed.ts         # Database seeding
│       ├── src/
│       │   └── index.ts        # Prisma client export
│       └── package.json
├── services/
│   └── vanna/                  # FastAPI service
│       ├── main.py             # FastAPI app
│       ├── requirements.txt
│       └── pyproject.toml
├── data/
│   └── Analytics_Test_Data.json # Sample invoice data
├── package.json                # Root package.json
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **Python**: v3.9 or higher
- **pip**: Python package installer

### Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### Verify Installations

```bash
node --version  # Should be >= 18.0.0
pnpm --version  # Should be >= 8.0.0
python --version # Should be >= 3.9
```

## 🚀 Quick Start

Follow these steps to get the project running locally:

### 1. Clone & Navigate

```bash
cd "c:\Users\Santosh Vishwakarma\Desktop\New folder (2)"
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example env file
copy .env.example .env

# The default values should work for local development
```

### 4. Initialize Database

```bash
# Generate Prisma client
pnpm --filter @buchhaltung/db db:generate

# Run migrations
pnpm --filter @buchhaltung/db prisma migrate dev --name init

# Seed the database
pnpm --filter @buchhaltung/db seed
```

### 5. Install Python Dependencies

```bash
cd services/vanna
pip install -r requirements.txt
cd ../..
```

### 6. Start the Vanna Service

Open a new terminal window:

```bash
# Option 1: Using pnpm script (from root)
pnpm vanna:dev

# Option 2: Direct uvicorn command
cd services/vanna
uvicorn main:app --reload --port 8000
```

The Vanna service will be available at: http://localhost:8000

### 7. Start the Next.js Application

In another terminal window:

```bash
pnpm dev
```

The application will be available at: http://localhost:3000

### 8. Access the Application

- **Dashboard**: http://localhost:3000
- **Chat with Data**: http://localhost:3000/chat
- **Vanna API**: http://localhost:8000
- **Vanna API Docs**: http://localhost:8000/docs

## 🔧 Detailed Setup

### Database Configuration

The project uses SQLite by default for local development. The database file will be created at:
```
packages/db/dev.db
```

#### Migration to PostgreSQL (Production)

1. Update `packages/db/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

3. Run migrations:

```bash
pnpm --filter @buchhaltung/db prisma migrate dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="file:./dev.db"
DATABASE_PATH="./packages/db/dev.db"

# Next.js
NEXT_PUBLIC_API_BASE="/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Vanna Service
VANNA_API_BASE_URL="http://localhost:8000"
VANNA_API_KEY="none"
```

## 💻 Development

### Available Scripts

#### Root Level

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all dev servers (Next.js only)
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm vanna:dev        # Start Vanna FastAPI service
pnpm vanna:install    # Install Vanna Python dependencies
```

#### Database Package

```bash
pnpm --filter @buchhaltung/db prisma migrate dev    # Run migrations
pnpm --filter @buchhaltung/db db:generate           # Generate Prisma client
pnpm --filter @buchhaltung/db seed                  # Seed database
pnpm --filter @buchhaltung/db studio                # Open Prisma Studio
```

#### Web Package

```bash
pnpm --filter @buchhaltung/web dev      # Start Next.js dev server
pnpm --filter @buchhaltung/web build    # Build for production
pnpm --filter @buchhaltung/web start    # Start production server
pnpm --filter @buchhaltung/web lint     # Lint code
```

### Development Workflow

1. **Make changes** to your code
2. **Hot reload** will automatically refresh the browser
3. **Check for errors** in the terminal
4. **Test API endpoints** using the Chat interface or directly via fetch/curl
5. **View database** with Prisma Studio: `pnpm --filter @buchhaltung/db studio`

## 🏗 Architecture

### Data Flow

```
User → Next.js UI → API Routes → Prisma → SQLite
                         ↓
                   Vanna Service → SQLite (read-only)
```

### Key Design Decisions

1. **SQLite for Development**: Fast, zero-config, file-based database
2. **Prisma ORM**: Type-safe database access with automatic migrations
3. **Rule-Based NLP**: Deterministic, no external API dependencies
4. **Turborepo**: Efficient caching and parallel execution
5. **App Router**: Modern Next.js routing with server components where beneficial

## 📚 API Documentation

### REST Endpoints

All endpoints are prefixed with `/api`.

#### GET `/api/stats`

Returns overview statistics.

**Response:**
```json
{
  "totalSpend": 1050234.75,
  "totalInvoices": 64,
  "documentsUploaded": 17,
  "avgInvoiceValue": 16409.92,
  "monthlyChange": {
    "spend": 4.25,
    "invoices": 8.2
  }
}
```

#### GET `/api/invoice-trends?months=12`

Returns monthly invoice trends.

**Query Parameters:**
- `months` (optional): Number of months to return (default: 12)

**Response:**
```json
[
  {
    "month": "2024-11",
    "invoiceCount": 27,
    "totalSpend": 8079.25
  }
]
```

#### GET `/api/vendors-top10?limit=10`

Returns top vendors by spend.

**Query Parameters:**
- `limit` (optional): Number of vendors to return (default: 10)

**Response:**
```json
[
  {
    "vendor": "Phonix GmbH",
    "totalSpend": 921784.00,
    "invoiceCount": 3,
    "percentage": 45.2
  }
]
```

#### GET `/api/category-spend`

Returns spending by category.

**Response:**
```json
[
  {
    "category": "Operations",
    "totalSpend": 900000.00,
    "invoiceCount": 40,
    "percentage": 60.5
  }
]
```

#### GET `/api/cash-outflow`

Returns cash outflow forecast grouped by periods.

**Response:**
```json
[
  {
    "period": "0-7 days",
    "expectedOutflow": 50000.00,
    "invoiceCount": 5
  }
]
```

#### GET `/api/invoices`

Returns paginated invoices.

**Query Parameters:**
- `search` (optional): Search by invoice number or vendor name
- `status` (optional): Filter by status (paid, pending, overdue)
- `limit` (optional): Page size (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `sort` (optional): Sort field (date, vendor, amount)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "invoices": [...],
  "total": 64,
  "page": 1,
  "pageSize": 20
}
```

#### POST `/api/chat-with-data`

Processes natural language query.

**Request Body:**
```json
{
  "query": "Total spend in the last 90 days"
}
```

**Response:**
```json
{
  "sql": "SELECT SUM(totalAmount) as total FROM Invoice WHERE date(date) >= date('now', '-90 day')",
  "results": [{ "total": 856250.75 }],
  "explanation": "Calculating total spend from invoices in the last 90 days"
}
```

## 🗄 Database Schema

### Models

- **Vendor**: Company/individual sending invoices
- **Customer**: Invoice recipient
- **Invoice**: Main invoice entity
- **LineItem**: Individual items on invoices
- **Payment**: Payment records

### Relationships

```
Vendor ──< Invoice >── Customer
           ↓
        LineItem
           ↓
        Payment
```

### Key Fields

**Invoice**:
- `invoiceNumber`: Unique identifier
- `date`: Invoice date
- `dueDate`: Payment due date
- `totalAmount`: Total invoice value
- `status`: paid | pending | overdue | draft
- `category`: Invoice category

## 🚢 Deployment

### Production Checklist

- [ ] Switch to PostgreSQL database
- [ ] Set production environment variables
- [ ] Build optimized production bundle
- [ ] Configure CORS for Vanna service
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure database backups

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm --filter @buchhaltung/web start
```

### Environment Variables (Production)

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXT_PUBLIC_API_BASE="/api"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
VANNA_API_BASE_URL="https://vanna.yourdomain.com"
NODE_ENV="production"
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database file not found

**Error**: `Database file not found at ./packages/db/dev.db`

**Solution**:
```bash
# Generate Prisma client
pnpm --filter @buchhaltung/db db:generate

# Run migrations
pnpm --filter @buchhaltung/db prisma migrate dev --name init

# Seed the database
pnpm --filter @buchhaltung/db seed
```

#### 2. Vanna service not running

**Error**: `ECONNREFUSED` or `Vanna service unavailable`

**Solution**:
```bash
# Start Vanna service in a separate terminal
pnpm vanna:dev

# Or directly:
cd services/vanna
uvicorn main:app --reload --port 8000
```

#### 3. Port already in use

**Error**: `Port 3000 already in use`

**Solution**:
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 pnpm dev
```

#### 4. Module not found errors

**Error**: `Cannot find module '@buchhaltung/db'`

**Solution**:
```bash
# Clean install
rm -rf node_modules
pnpm install

# Generate Prisma client
pnpm --filter @buchhaltung/db db:generate
```

#### 5. Python dependencies issues

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
cd services/vanna
pip install -r requirements.txt
```

### Checking Service Health

#### Vanna Service
```bash
curl http://localhost:8000/health
```

#### Next.js API
```bash
curl http://localhost:3000/api/stats
```

### Database Issues

View database contents:
```bash
pnpm --filter @buchhaltung/db studio
```

Reset database:
```bash
# Delete database file
rm packages/db/dev.db

# Run migrations and seed again
pnpm --filter @buchhaltung/db prisma migrate dev --name init
pnpm --filter @buchhaltung/db seed
```

## 📝 Notes

### Design Decisions

1. **SQLite for Development**: Chosen for zero-config setup and portability. Migration path to PostgreSQL is straightforward.

2. **Rule-Based NLP**: Instead of using external LLMs, implemented pattern matching for common queries. This ensures:
   - No external API dependencies
   - Deterministic behavior
   - No API costs
   - Fast response times

3. **Monorepo Structure**: Turborepo provides efficient caching and allows for easy scaling to microservices.

4. **Type Safety**: Full TypeScript coverage with strict mode ensures fewer runtime errors.

### Future Enhancements

- [ ] Add authentication (NextAuth.js)
- [ ] Implement real-time updates (WebSockets)
- [ ] Add PDF invoice upload and OCR
- [ ] Expand NLP patterns for more complex queries
- [ ] Add unit and integration tests
- [ ] Implement role-based access control
- [ ] Add invoice approval workflow
- [ ] Export reports (PDF, Excel)

## 📄 License

This project is created for the Full Stack Developer Internship assignment.

## 👥 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, Prisma, and FastAPI**
