export const dynamic = 'force-dynamic';

import { getWaterSources } from "@/lib/data";
import Link from "next/link";
import { Droplet, AlertTriangle, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  const sources = await getWaterSources();

  // Calculate statistics
  const totalSources = sources.length;
  const workingSources = sources.filter(
    (s) =>
      s.status?.toLowerCase().includes("working") ||
      s.status?.toLowerCase().includes("operational")
  ).length;
  const limitedSources = sources.filter(
    (s) =>
      s.status?.toLowerCase().includes("limited") ||
      s.status?.toLowerCase().includes("maintenance")
  ).length;
  const brokenSources = sources.filter(
    (s) =>
      s.status?.toLowerCase().includes("broken") ||
      s.status?.toLowerCase().includes("non")
  ).length;

  // Group by district
  const districtCounts: Record<string, number> = {};
  sources.forEach((source) => {
    const district = source.district || "Unknown";
    districtCounts[district] = (districtCounts[district] || 0) + 1;
  });

  // Group by village
  const villageCounts: Record<string, number> = {};
  sources.forEach((source) => {
    const village = source.village || "Unknown";
    villageCounts[village] = (villageCounts[village] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Comprehensive view of all water sources</p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{totalSources}</p>
          <p className="text-gray-500 font-medium">Total Sources</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-green-700 mb-1">{workingSources}</p>
          <p className="text-gray-500 font-medium">Working</p>
          {totalSources > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {((workingSources / totalSources) * 100).toFixed(1)}%
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-orange-700 mb-1">{limitedSources}</p>
          <p className="text-gray-500 font-medium">Limited</p>
          {totalSources > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {((limitedSources / totalSources) * 100).toFixed(1)}%
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-red-700 mb-1">{brokenSources}</p>
          <p className="text-gray-500 font-medium">Broken</p>
          {totalSources > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {((brokenSources / totalSources) * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      {/* District and Village Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Districts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Sources by District
          </h2>
          <div className="space-y-3">
            {Object.entries(districtCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([district, count]) => (
                <div
                  key={district}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-gray-700">{district}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {count} sources
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Villages */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Sources by Village
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(villageCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([village, count]) => (
                <div
                  key={village}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-gray-700">{village}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    {count} sources
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/sources"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Manage Water Sources
          </Link>
          <Link
            href="/admin/reports"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Review Reports
          </Link>
          <Link
            href="/statistics"
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View Statistics
          </Link>
        </div>
      </div>
    </div>
  );
}
