"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "./ui/input";

export function Header() {
  return (
    <header className="fixed left-sidebar right-0 top-0 z-30 h-header border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Page title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-brand-800">Dashboard</h1>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-10"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium text-brand-800">Amit Jadhav</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
