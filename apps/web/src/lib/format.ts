// Utility functions for formatting data

/**
 * Format a number as currency (Euro)
 */
export function formatCurrency(value: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a date string
 */
export function formatDate(date: string | Date, format: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "long") {
    return new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  }

  return new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Format a month string (e.g., "2025-01" -> "Jan 2025")
 */
export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimals
}

/**
 * Format percentage change
 */
export function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "paid":
      return "text-green-600 bg-green-50";
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "overdue":
      return "text-red-600 bg-red-50";
    case "draft":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Generate a random color for charts
 */
export function generateColor(index: number): string {
  const colors = [
    "#1f6feb",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#ef4444",
    "#f59e0b",
    "#eab308",
  ];
  return colors[index % colors.length];
}
