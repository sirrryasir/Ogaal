"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, DashboardStats } from "@/lib/data";
import { Loader2, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    setLoading(true);
    const data = await getDashboardStats();
    setStats(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">Real-time water security monitoring.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-semibold"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Total Sources",
            val: stats.totalSources,
            color: "bg-blue-500",
          },
          {
            label: "Pending Reports",
            val: stats.pendingReports,
            color: "bg-orange-500",
          },
          {
            label: "Critical Zones",
            val: stats.criticalZones,
            color: "bg-red-500",
          },
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
          <Link
            href="/admin/reports"
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            View All Reports
          </Link>
        </div>
        <div className="space-y-4">
          {stats.recentReports.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No recent activity</p>
          ) : (
            stats.recentReports.map((report: any) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {report.reporter_type === "USSD" ? "SMS" : "WEB"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      Report: {report.water_source?.name || "Unknown Source"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {report.village?.name} •{" "}
                      {new Date(report.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    report.is_verified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {report.is_verified ? "Verified" : "Pending"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
