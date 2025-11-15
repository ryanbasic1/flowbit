"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/format";
import type { Invoice } from "@/lib/types";

interface InvoicesTableProps {
  invoices: Invoice[];
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Invoices by Vendor</CardTitle>
        <p className="text-sm text-gray-500">Top vendors by invoice count and net value</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto" style={{ maxHeight: "600px" }}>
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 text-xs font-medium text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Vendor</th>
                <th className="px-6 py-3 text-left"># Invoices</th>
                <th className="px-6 py-3 text-right">Net Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-xs font-semibold text-accent-700">
                        {invoice.vendor.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-brand-800">{invoice.vendor}</div>
                        <div className="text-xs text-gray-500">{invoice.invoiceNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-brand-700">{formatDate(invoice.date)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-semibold text-brand-800">
                      {formatCurrency(invoice.amount)}
                    </div>
                    <div className="text-xs">
                      <span className={`inline-block rounded-full px-2 py-0.5 ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
