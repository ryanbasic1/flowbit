"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Search, Plus, Mail, Phone } from "lucide-react";
import { useState } from "react";

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+49 30 1234567",
    role: "Manager",
    department: "Finance",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@company.com",
    phone: "+49 30 1234568",
    role: "Manager",
    department: "Operations",
    status: "active",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.d@company.com",
    phone: "+49 30 1234569",
    role: "Manager",
    department: "Marketing",
    status: "active",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.w@company.com",
    phone: "+49 30 1234570",
    role: "Manager",
    department: "IT Services",
    status: "active",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@company.com",
    phone: "+49 30 1234571",
    role: "Manager",
    department: "HR",
    status: "active",
  },
  {
    id: 6,
    name: "James Brown",
    email: "james.b@company.com",
    phone: "+49 30 1234572",
    role: "Staff",
    department: "Finance",
    status: "active",
  },
  {
    id: 7,
    name: "Maria Garcia",
    email: "maria.g@company.com",
    phone: "+49 30 1234573",
    role: "Staff",
    department: "Operations",
    status: "active",
  },
  {
    id: 8,
    name: "Robert Taylor",
    email: "robert.t@company.com",
    phone: "+49 30 1234574",
    role: "Staff",
    department: "Marketing",
    status: "inactive",
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getRoleBadge = (role: string) => {
    return role === "Manager" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="mt-1 text-sm text-gray-500">Manage user accounts and permissions</p>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600">
                <Plus className="h-4 w-4" />
                Add User
              </button>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600">Managers</p>
                <p className="mt-1 text-2xl font-bold text-purple-600">
                  {users.filter((u) => u.role === "Manager").length}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                              <span className="text-sm font-medium">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {user.department}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <button className="text-accent-600 hover:text-accent-800">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Results */}
            {filteredUsers.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                No users found matching your search
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
