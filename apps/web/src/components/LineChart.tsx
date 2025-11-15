"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency, formatNumber, formatMonth } from "@/lib/format";
import type { InvoiceTrend } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface LineChartProps {
  data: InvoiceTrend[];
}

export function LineChart({ data }: LineChartProps) {
  const chartData = {
    labels: data.map((item) => formatMonth(item.month)),
    datasets: [
      {
        label: "Invoice Count",
        data: data.map((item) => item.invoiceCount),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        yAxisID: "y",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Total Spend",
        data: data.map((item) => item.totalSpend),
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        yAxisID: "y1",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 1) {
                label += formatCurrency(context.parsed.y);
              } else {
                label += formatNumber(context.parsed.y);
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Invoice Count",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Total Spend (€)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Invoice Volume + Value Trend</CardTitle>
        <p className="text-sm text-gray-500">Invoice count and total spend over 12 months</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
