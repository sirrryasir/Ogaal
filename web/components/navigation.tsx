"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MapPin,
  Activity,
  Calculator,
  Droplets,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Map", href: "/water-sources", icon: MapPin },
  { label: "Report", href: "/report", icon: Activity },
  { label: "Planner", href: "/calculator", icon: Calculator },
  { label: "Admin", href: "/admin", icon: Droplets },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 py-4 transition-all duration-300",
          "bg-white/80 backdrop-blur-md shadow-sm"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
            A
          </div>
          <span
            className={cn(
              "font-bold text-xl tracking-tight",
              "text-gray-900"
            )}
          >
            AquaGuard
          </span>
        </Link>
        <nav className="flex items-center gap-1 bg-white/10 backdrop-blur-sm p-1 rounded-full border border-white/20">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "text-blue-600 bg-white shadow-sm"
                    : "text-gray-600 hover:text-blue-500"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav"
                    className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="w-8" /> {/* Spacer for balance */}
      </motion.header>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-bold text-lg text-gray-900">AquaGuard</span>
        </Link>
        <button
          className="p-2 text-gray-600"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-gray-900/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/10 p-2 flex justify-between items-center px-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all",
                isActive
                  ? "text-blue-400 scale-110"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <item.icon
                className={cn("w-6 h-6 mb-0.5", isActive && "fill-current")}
              />
            </Link>
          );
        })}
      </nav>

      {/* Mobile Full Screen Menu (Optional for more items) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-2xl text-gray-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg">{item.label}</span>
                </Link>
              ))}

              <div className="h-px bg-gray-200 my-4" />

              <Link
                href="/settings"
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600"
              >
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="font-medium text-lg">Settings</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
