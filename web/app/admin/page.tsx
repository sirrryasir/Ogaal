"use client";

import { getWaterSources } from "@/lib/data";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Sources", val: "42", color: "bg-blue-500" },
          { label: "Pending Reports", val: "12", color: "bg-orange-500" },
          { label: "Critical Zones", val: "3", color: "bg-red-500" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <span className="text-xs font-bold text-gray-400 uppercase">
                Real-time
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{stat.val}</p>
            <p className="text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 text-sm font-bold hover:underline">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  AH
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    Ahmed Hassan submitting a report
                  </p>
                  <p className="text-xs text-gray-500">
                    Village Central Well • 2 mins ago
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                Review
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
