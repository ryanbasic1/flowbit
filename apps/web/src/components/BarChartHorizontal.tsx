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
import type { TopVendor } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartHorizontalProps {
  data: TopVendor[];
}

export function BarChartHorizontal({ data }: BarChartHorizontalProps) {
  // Create gradient colors
  const colors = data.map((_, index) => {
    const intensity = 1 - index * 0.08;
    return `rgba(31, 111, 235, ${intensity})`;
  });

  const chartData = {
    labels: data.map((item) => item.vendor),
    datasets: [
      {
        label: "Total Spend",
        data: data.map((item) => item.totalSpend),
        backgroundColor: colors,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return formatCurrency(context.parsed.x);
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value: any) {
            return "€" + (value / 1000).toFixed(0) + "k";
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spend by Vendor (Top 10)</CardTitle>
        <p className="text-sm text-gray-500">Vendor spend with distribution</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
