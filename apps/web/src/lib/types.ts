// Type definitions for API responses

export interface OverviewStats {
  totalSpend: number;
  totalInvoices: number;
  documentsUploaded: number;
  avgInvoiceValue: number;
  monthlyChange: {
    spend: number;
    invoices: number;
  };
}

export interface InvoiceTrend {
  month: string;
  invoiceCount: number;
  totalSpend: number;
}

export interface TopVendor {
  vendor: string;
  totalSpend: number;
  invoiceCount: number;
  percentage?: number;
}

export interface CategorySpend {
  category: string;
  totalSpend: number;
  invoiceCount: number;
  percentage?: number;
}

export interface CashOutflowData {
  period: string;
  expectedOutflow: number;
  invoiceCount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  category?: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ChatResponse {
  sql: string;
  results: any[];
  explanation?: string;
}

export interface ApiError {
  error: string;
  message: string;
}
