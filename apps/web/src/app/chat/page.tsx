"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import type { ChatResponse } from "@/lib/types";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  sql?: string;
  results?: any[];
  explanation?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Welcome to Chat with Data! Ask me questions about your invoices, vendors, spending, or cash flow. I'll generate SQL queries and show you the results.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedSql, setExpandedSql] = useState<Set<string>>(new Set());

  const toggleSqlExpanded = (messageId: string) => {
    setExpandedSql((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post<ChatResponse>("/chat-with-data", {
        query: input.trim(),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.explanation || "Here are the results:",
        sql: response.sql,
        results: response.results,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Error: ${error.message || "Failed to process query"}. ${
          error.status === 503
            ? "Make sure the Vanna service is running (pnpm vanna:dev)."
            : ""
        }`,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-sidebar">
        <Header />

        <main className="flex-1 overflow-auto pt-header">
          <div className="mx-auto max-w-5xl p-6">
            <Card className="flex h-[calc(100vh-120px)] flex-col">
              <CardHeader className="border-b">
                <CardTitle>Chat with Your Data</CardTitle>
                <p className="text-sm text-gray-500">
                  Ask questions in natural language and I'll query your invoice database
                </p>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.type === "user"
                            ? "bg-accent-500 text-white"
                            : "bg-gray-100 text-brand-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>

                        {/* SQL Query Section */}
                        {message.sql && (
                          <div className="mt-3 rounded-md bg-white p-3">
                            <button
                              onClick={() => toggleSqlExpanded(message.id)}
                              className="flex w-full items-center justify-between text-xs font-semibold text-brand-800"
                            >
                              <span>Generated SQL</span>
                              {expandedSql.has(message.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            {expandedSql.has(message.id) && (
                              <pre className="mt-2 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                                {message.sql}
                              </pre>
                            )}
                          </div>
                        )}

                        {/* Results Table */}
                        {message.results && message.results.length > 0 && (
                          <div className="mt-3 overflow-x-auto rounded-md bg-white p-3">
                            <p className="mb-2 text-xs font-semibold text-brand-800">
                              Results ({message.results.length} rows)
                            </p>
                            <table className="w-full text-xs">
                              <thead className="border-b">
                                <tr>
                                  {Object.keys(message.results[0]).map((key) => (
                                    <th
                                      key={key}
                                      className="px-2 py-1 text-left font-semibold text-gray-700"
                                    >
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {message.results.slice(0, 10).map((row, idx) => (
                                  <tr key={idx} className="border-b last:border-0">
                                    {Object.values(row).map((val: any, i) => (
                                      <td key={i} className="px-2 py-1 text-gray-800">
                                        {typeof val === "number"
                                          ? val.toLocaleString()
                                          : String(val)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {message.results.length > 10 && (
                              <p className="mt-2 text-xs text-gray-500">
                                Showing 10 of {message.results.length} results
                              </p>
                            )}
                          </div>
                        )}

                        {message.results && message.results.length === 0 && (
                          <div className="mt-3 rounded-md bg-yellow-50 p-3 text-xs text-yellow-800">
                            No results found
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm text-brand-800">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Input Form */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ask a question (e.g., 'What's the total spend in the last 30 days?')"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading || !input.trim()}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>

                {/* Example Questions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <p className="w-full text-xs text-gray-500">Try asking:</p>
                  {[
                    "Total spend in the last 90 days",
                    "Top 5 vendors",
                    "Overdue invoices",
                    "Cash outflow next 30 days",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setInput(example)}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                      disabled={loading}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
