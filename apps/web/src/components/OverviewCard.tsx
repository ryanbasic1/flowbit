"use client";

import { Card, CardContent } from "./ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatNumber, formatPercentageChange } from "@/lib/format";

interface OverviewCardProps {
  title: string;
  value: string | number;
  change?: number;
  isYTD?: boolean;
  isCurrency?: boolean;
}

export function OverviewCard({ title, value, change, isYTD, isCurrency }: OverviewCardProps) {
  const formattedValue =
    typeof value === "number"
      ? isCurrency
        ? formatCurrency(value)
        : formatNumber(value)
      : value;

  const isPositive = change !== undefined ? change >= 0 : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isYTD && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                YTD
              </span>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-brand-800">{formattedValue}</p>
              {change !== undefined && (
                <div className="flex items-center gap-1 text-xs">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={isPositive ? "text-green-600" : "text-red-600"}>
                    {formatPercentageChange(change)}
                  </span>
                  <span className="text-gray-500">from last month</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
