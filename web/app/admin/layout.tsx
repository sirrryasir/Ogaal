"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Droplet,
  AlertOctagon,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role, setRole } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple Mock Auth
  if (!isAuthenticated && role !== "admin") {
    // Check role just in case store persisted
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Ogaal Admin</h1>
            <p className="text-gray-500">Sign in to manage resources</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
              setRole("admin");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@Ogaal.so"
                className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-100 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                defaultValue="password"
                className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-100 focus:border-blue-500 outline-none"
              />
            </div>
            <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors">
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/reports", label: "Approvals", icon: FileText },
    { href: "/admin/sources", label: "Water Sources", icon: Droplet },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Ogaal</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setRole("community");
            }}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
