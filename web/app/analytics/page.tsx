"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getWaterSources, getDashboardStats, WaterSource, DashboardStats } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2, TrendingUp, Droplet, AlertTriangle, MapPin } from "lucide-react";

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ),
});

export default function AnalyticsPage() {
  const [sources, setSources] = useState<WaterSource[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sourcesData, statsData] = await Promise.all([
          getWaterSources(),
          getDashboardStats(),
        ]);
        setSources(sourcesData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Prepare chart data
  const statusData = sources.reduce((acc, source) => {
    const status = source.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }));

  const villageData = sources.reduce((acc, source) => {
    acc[source.village] = (acc[source.village] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const villageChartData = Object.entries(villageData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([village, count]) => ({ village, count }));

  const COLORS = ['#22c55e', '#f97316', '#ef4444', '#9ca3af'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor water source conditions and system performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sources</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalSources || sources.length}</p>
              </div>
              <Droplet className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingReports || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Zones</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.criticalZones || 0}</p>
              </div>
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Monitoring</p>
                <p className="text-2xl font-bold text-gray-900">{sources.filter(s => s.status.toLowerCase().includes('working')).length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Villages by Source Count</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={villageChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="village" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Sources Map</h3>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapView
              sources={sources}
              onSelectSource={setSelectedSource}
              selectedSourceId={selectedSource?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}