"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Droplet,
  Database,
  LogOut,
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { href: "/admin/database", label: "Database", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex -mt-20">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Ogaal</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-white border-r border-gray-200 flex-shrink-0 fixed h-full top-0 left-0 z-10 flex flex-col transition-transform duration-300 ease-in-out",
        "md:translate-x-0", // Always visible on desktop
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" // Hidden on mobile unless open
      )}>
        {/* Desktop Logo */}
        <div className="hidden md:block p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Ogaal</span>
          </Link>
        </div>

        {/* Mobile Logo - smaller padding */}
        <div className="md:hidden p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <Droplet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Ogaal</span>
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
                onClick={() => setIsMobileMenuOpen(false)}
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
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-5"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto pt-16 md:pt-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
