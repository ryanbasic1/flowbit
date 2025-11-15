"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Building2, Users, Plus } from "lucide-react";

const departments = [
  { id: 1, name: "Finance", users: 12, manager: "Sarah Johnson", budget: 250000 },
  { id: 2, name: "Operations", users: 28, manager: "Michael Chen", budget: 450000 },
  { id: 3, name: "Marketing", users: 15, manager: "Emma Davis", budget: 180000 },
  { id: 4, name: "IT Services", users: 18, manager: "David Wilson", budget: 320000 },
  { id: 5, name: "Human Resources", users: 8, manager: "Lisa Anderson", budget: 120000 },
];

export default function DepartmentsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-sidebar">
        <Header />

        <main className="flex-1 overflow-auto pt-header">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage organizational departments and budgets
                </p>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600">
                <Plus className="h-4 w-4" />
                Add Department
              </button>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Departments</p>
                    <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {departments.reduce((sum, dept) => sum + dept.users, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900">
                      €{(departments.reduce((sum, dept) => sum + dept.budget, 0) / 1000).toFixed(0)}
                      k
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-accent-100 p-3">
                      <Building2 className="h-8 w-8 text-accent-600" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{dept.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{dept.users} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Manager:</span>
                      <span>{dept.manager}</span>
                    </div>
                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Annual Budget</p>
                      <p className="text-xl font-bold text-gray-900">
                        €{(dept.budget / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
