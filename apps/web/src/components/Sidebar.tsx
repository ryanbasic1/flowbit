"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Settings,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Invoice", href: "/invoices", icon: FileText },
  { name: "Other files", href: "/files", icon: FileText },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Chat with Data", href: "/chat", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-sidebar border-r border-gray-200 bg-sidebar-bg">
      {/* Logo */}
      <div className="flex h-header items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500">
            <span className="text-sm font-bold text-white">B</span>
          </div>
          <span className="text-lg font-semibold text-brand-800">Buchhaltung</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-3 py-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          General
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-50 text-accent-600"
                  : "text-sidebar-text hover:bg-gray-100 hover:text-brand-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer - Flowbit AI indicator */}
      <div className="absolute bottom-4 left-0 right-0 px-6">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-blue-500">
            <span className="text-xs font-bold text-white">★</span>
          </div>
          <span className="font-medium">Flowbit AI</span>
        </div>
      </div>
    </div>
  );
}
