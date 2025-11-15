"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency, generateColor } from "@/lib/format";
import type { CategorySpend } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data: CategorySpend[];
}

export function DonutChart({ data }: DonutChartProps) {
  const colors = data.map((_, index) => generateColor(index));

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.totalSpend),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = formatCurrency(context.parsed);
            const percentage = data[context.dataIndex]?.percentage?.toFixed(1) || "0";
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spend by Category</CardTitle>
        <p className="text-sm text-gray-500">Distribution of spending across different categories</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
