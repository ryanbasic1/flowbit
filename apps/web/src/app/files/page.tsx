"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { FileText, Upload, FolderOpen } from "lucide-react";

export default function FilesPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-sidebar">
        <Header />

        <main className="flex-1 overflow-auto pt-header">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Other Files</h1>
              <p className="mt-1 text-sm text-gray-500">Upload and manage supporting documents</p>
            </div>

            {/* Upload Area */}
            <div className="mb-6 rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Upload Files</h3>
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop files here, or click to browse
              </p>
              <button className="mt-4 rounded-lg bg-accent-500 px-6 py-2 text-sm font-medium text-white hover:bg-accent-600">
                Select Files
              </button>
            </div>

            {/* File List */}
            <div className="rounded-lg border border-gray-200 bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-500">No files uploaded yet</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Upload your first file to get started
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
