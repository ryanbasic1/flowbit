"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency } from "@/lib/format";
import type { CashOutflowData } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CashOutflowChartProps {
  data: CashOutflowData[];
}

export function CashOutflowChart({ data }: CashOutflowChartProps) {
  const chartData = {
    labels: data.map((item) => item.period),
    datasets: [
      {
        label: "Expected Outflow",
        data: data.map((item) => item.expectedOutflow),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = formatCurrency(context.parsed.y);
            const invoices = data[context.dataIndex]?.invoiceCount || 0;
            return [`Amount: ${value}`, `Invoices: ${invoices}`];
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: any) {
            return "€" + (value / 1000).toFixed(0) + "k";
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cash Outflow Forecast</CardTitle>
        <p className="text-sm text-gray-500">Expected payment obligations grouped by due date ranges</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
