"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Bell, Lock, Globe, Database, Palette, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-sidebar">
        <Header />

        <main className="flex-1 overflow-auto pt-header">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your application preferences and configuration
              </p>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* General */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">General</h3>
                <p className="mb-4 text-sm text-gray-500">
                  Language, timezone, and regional settings
                </p>
                <button className="text-sm font-medium text-accent-600 hover:text-accent-700">
                  Configure →
                </button>
              </div>

              {/* Notifications */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <Bell className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Notifications</h3>
                <p className="mb-4 text-sm text-gray-500">
                  Email alerts and notification preferences
                </p>
                <button className="text-sm font-medium text-accent-600 hover:text-accent-700">
                  Configure →
                </button>
              </div>

              {/* Security */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Security</h3>
                <p className="mb-4 text-sm text-gray-500">Password, 2FA, and security settings</p>
                <button className="text-sm font-medium text-accent-600 hover:text-accent-700">
                  Configure →
                </button>
              </div>

              {/* Database */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Database</h3>
                <p className="mb-4 text-sm text-gray-500">Backup, restore, and data management</p>
                <button className="text-sm font-medium text-accent-600 hover:text-accent-700">
                  Configure →
                </button>
              </div>

              {/* Appearance */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Appearance</h3>
                <p className="mb-4 text-sm text-gray-500">Theme, colors, and display preferences</p>
                <button className="text-sm font-medium text-accent-600 hover:text-accent-700">
                  Configure →
                </button>
              </div>

              {/* Privacy */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Privacy</h3>
                <p className="mb-4 text-sm text-gray-500">Data privacy and compliance settings</p>
                <button className="text-sm font-medium text-accent-600 hover:text-accent-700">
                  Configure →
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">System Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Version</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">1.0.0</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Database</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">SQLite</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Environment</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">Development</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
