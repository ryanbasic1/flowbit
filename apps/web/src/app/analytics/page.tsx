"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [confidenceData, setConfidenceData] = useState<any>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [deptRes, confRes, fileRes] = await Promise.all([
          fetch("/api/department-analytics"),
          fetch("/api/confidence-analysis"),
          fetch("/api/file-metadata"),
        ]);

        const [dept, conf, file] = await Promise.all([
          deptRes.json(),
          confRes.json(),
          fileRes.json(),
        ]);

        setDepartmentData(dept);
        setConfidenceData(conf);
        setFileData(file);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Advanced Analytics</h1>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Advanced Analytics Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Full analysis of all 50 invoices from Analytics_Test_Data.json
      </p>

      {/* Confidence Analysis */}
      {confidenceData && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">AI Extraction Quality</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {(parseFloat(confidenceData.summary.avgConfidence) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Human Validation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {confidenceData.summary.humanValidationRate}%
                </p>
                <p className="text-sm text-gray-500">
                  {confidenceData.summary.humanValidatedCount} /{" "}
                  {confidenceData.summary.totalInvoices} validated
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Needs Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  {confidenceData.summary.lowConfidenceCount}
                </p>
                <p className="text-sm text-gray-500">Low confidence invoices</p>
              </CardContent>
            </Card>
          </div>

          {/* Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Confidence Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-32">High (&gt;90%)</span>
                  <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden">
                    <div
                      className="bg-green-500 h-full"
                      style={{
                        width: `${
                          (confidenceData.distribution.high /
                            confidenceData.summary.totalInvoices) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="ml-2 w-12 text-right">
                    {confidenceData.distribution.high}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-32">Medium (70-90%)</span>
                  <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full"
                      style={{
                        width: `${
                          (confidenceData.distribution.medium /
                            confidenceData.summary.totalInvoices) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="ml-2 w-12 text-right">
                    {confidenceData.distribution.medium}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-32">Low (&lt;70%)</span>
                  <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden">
                    <div
                      className="bg-red-500 h-full"
                      style={{
                        width: `${
                          (confidenceData.distribution.low /
                            confidenceData.summary.totalInvoices) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="ml-2 w-12 text-right">
                    {confidenceData.distribution.low}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Needing Review */}
          {confidenceData.needsReview.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Invoices Needing Review (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Invoice #</th>
                        <th className="text-left p-2">Vendor</th>
                        <th className="text-right p-2">Amount</th>
                        <th className="text-right p-2">Confidence</th>
                        <th className="text-center p-2">Validated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confidenceData.needsReview.map((inv: any, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2">{inv.invoiceNumber}</td>
                          <td className="p-2">{inv.vendor}</td>
                          <td className="p-2 text-right">
                            €{inv.amount.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">
                            <span className="text-orange-600 font-semibold">
                              {(inv.confidence * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            {inv.validated ? "✅" : "❌"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Department Analytics */}
      {departmentData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Department Performance</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4">Department ID</th>
                      <th className="text-right p-4">Total Spent</th>
                      <th className="text-center p-4">Invoices</th>
                      <th className="text-center p-4">Paid</th>
                      <th className="text-center p-4">Pending</th>
                      <th className="text-right p-4">Avg Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((dept: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono text-sm">
                          {dept.departmentId.slice(0, 12)}...
                        </td>
                        <td className="p-4 text-right font-semibold">
                          €{dept.totalSpent.toLocaleString()}
                        </td>
                        <td className="p-4 text-center">{dept.invoiceCount}</td>
                        <td className="p-4 text-center text-green-600">
                          {dept.paidCount}
                        </td>
                        <td className="p-4 text-center text-orange-600">
                          {dept.pendingCount}
                        </td>
                        <td className="p-4 text-right">
                          {(dept.avgConfidence * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File Metadata */}
      {fileData && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Document Files ({fileData.count})
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4">File Name</th>
                      <th className="text-left p-4">Vendor</th>
                      <th className="text-right p-4">Amount</th>
                      <th className="text-left p-4">Template</th>
                      <th className="text-center p-4">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.files.slice(0, 15).map((file: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm truncate max-w-xs">
                          {file.fileName}
                        </td>
                        <td className="p-4">{file.vendor}</td>
                        <td className="p-4 text-right">
                          €{file.amount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {file.template || "N/A"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {file.filePath ? (
                            <a
                              href={file.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View PDF
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
