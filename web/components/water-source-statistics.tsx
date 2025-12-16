"use client";

import { WaterSource } from "@/lib/data";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Droplet, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

interface WaterSourceStatisticsProps {
  sources: WaterSource[];
}

interface StatusCounts {
  working: number;
  low: number;
  dry: number;
}

const COLORS = {
  working: "#22c55e", // Green
  low: "#f97316", // Orange
  dry: "#ef4444", // Red
};

function categorizeStatus(status: string): "working" | "low" | "dry" {
  const s = status?.toLowerCase() || "";
  if (s.includes("working") || s.includes("good")) {
    return "working";
  }
  if (s.includes("low") || s.includes("maintenance")) {
    return "low";
  }
  if (s.includes("dry") || s.includes("no water") || s.includes("broken")) {
    return "dry";
  }
  // Default to working if unknown
  return "working";
}

function calculateStats(sources: WaterSource[]): StatusCounts {
  const counts: StatusCounts = {
    working: 0,
    low: 0,
    dry: 0,
  };

  sources.forEach((source) => {
    const category = categorizeStatus(source.status);
    counts[category]++;
  });

  return counts;
}

export default function WaterSourceStatistics({
  sources,
}: WaterSourceStatisticsProps) {
  const stats = calculateStats(sources);
  const total = sources.length;

  // Pie chart data
  const pieChartData = [
    { name: "Working", value: stats.working, color: COLORS.working },
    { name: "Low Water", value: stats.low, color: COLORS.low },
    { name: "Dry", value: stats.dry, color: COLORS.dry },
  ].filter((item) => item.value > 0);

  // Bar chart data
  const barChartData = [
    {
      name: "Working",
      value: stats.working,
      color: COLORS.working,
    },
    {
      name: "Low Water",
      value: stats.low,
      color: COLORS.low,
    },
    {
      name: "Dry",
      value: stats.dry,
      color: COLORS.dry,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p
            className="text-lg font-bold"
            style={{ color: payload[0].payload.color }}
          >
            {payload[0].value} sources
          </p>
          {total > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {((payload[0].value / total) * 100).toFixed(1)}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500 font-medium mt-1">
            Total Sources
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <Droplet className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-700">
            {stats.working}
          </div>
          <div className="text-sm text-gray-500 font-medium mt-1">
            Working
          </div>
          {total > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              {((stats.working / total) * 100).toFixed(1)}%
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-700">{stats.low}</div>
          <div className="text-sm text-gray-500 font-medium mt-1">
            Low Water
          </div>
          {total > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              {((stats.low / total) * 100).toFixed(1)}%
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-700">{stats.dry}</div>
          <div className="text-sm text-gray-500 font-medium mt-1">Dry</div>
          {total > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              {((stats.dry / total) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {/* Text Summary */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Summary Overview
        </h2>
        <div className="text-base md:text-lg text-gray-700 font-medium">
          Total: <span className="font-bold text-blue-600">{total}</span> water
          sources registered • Working:{" "}
          <span className="font-bold text-green-600">{stats.working}</span> • Low
          Water: <span className="font-bold text-orange-600">{stats.low}</span>{" "}
          • Dry: <span className="font-bold text-red-600">{stats.dry}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Distribution by Status
          </h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span
                      style={{ color: entry.color, fontSize: "14px" }}
                      className="font-medium"
                    >
                      {value}: {entry.payload.value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Status Comparison
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

