"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { OverviewCard } from "@/components/OverviewCard";
import { LineChart } from "@/components/LineChart";
import { BarChartHorizontal } from "@/components/BarChartHorizontal";
import { DonutChart } from "@/components/DonutChart";
import { CashOutflowChart } from "@/components/CashOutflowChart";
import { InvoicesTable } from "@/components/InvoicesTable";
import { api } from "@/lib/api";
import type {
  OverviewStats,
  InvoiceTrend,
  TopVendor,
  CategorySpend,
  CashOutflowData,
  Invoice,
} from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [trends, setTrends] = useState<InvoiceTrend[]>([]);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [categorySpend, setCategorySpend] = useState<CategorySpend[]>([]);
  const [cashOutflow, setCashOutflow] = useState<CashOutflowData[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [statsData, trendsData, vendorsData, categoryData, cashData, invoicesData] =
          await Promise.all([
            api.get<OverviewStats>("/stats"),
            api.get<InvoiceTrend[]>("/invoice-trends?months=12"),
            api.get<TopVendor[]>("/vendors-top10"),
            api.get<CategorySpend[]>("/category-spend"),
            api.get<CashOutflowData[]>("/cash-outflow"),
            api.get<{ invoices: Invoice[] }>("/invoices?limit=10"),
          ]);

        setStats(statsData);
        setTrends(trendsData);
        setTopVendors(vendorsData);
        setCategorySpend(categoryData);
        setCashOutflow(cashData);
        setInvoices(invoicesData.invoices);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-accent-500"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-sidebar">
        <Header />

        <main className="flex-1 overflow-auto pt-header">
          <div className="p-6">
            {/* Overview Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <OverviewCard
                title="Total Spend"
                value={stats?.totalSpend || 0}
                change={stats?.monthlyChange.spend}
                isYTD
                isCurrency
              />
              <OverviewCard
                title="Total Invoices Processed"
                value={stats?.totalInvoices || 0}
                change={stats?.monthlyChange.invoices}
              />
              <OverviewCard
                title="Documents Uploaded"
                value={stats?.documentsUploaded || 0}
              />
              <OverviewCard
                title="Average Invoice Value"
                value={stats?.avgInvoiceValue || 0}
                isCurrency
              />
            </div>

            {/* Main Chart - Invoice Trends */}
            <div className="mb-6">
              <LineChart data={trends} />
            </div>

            {/* Two Column Layout */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Top Vendors */}
              <BarChartHorizontal data={topVendors} />

              {/* Category Spend */}
              <DonutChart data={categorySpend} />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Cash Outflow */}
              <div className="lg:col-span-2">
                <CashOutflowChart data={cashOutflow} />
              </div>

              {/* Invoices Table */}
              <div className="lg:col-span-1">
                <InvoicesTable invoices={invoices} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
