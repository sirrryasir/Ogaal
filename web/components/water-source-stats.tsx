"use client";

import { WaterSource } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Droplet, AlertTriangle, XCircle } from "lucide-react";

interface WaterSourceStatsProps {
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

export default function WaterSourceStats({ sources }: WaterSourceStatsProps) {
  const stats = calculateStats(sources);
  const total = sources.length;

  const chartData = [
    { name: "Working", value: stats.working, color: COLORS.working },
    { name: "Low Water", value: stats.low, color: COLORS.low },
    { name: "Dry", value: stats.dry, color: COLORS.dry },
  ].filter((item) => item.value > 0); // Only show categories with data

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].payload.color }}>
            {payload[0].value} sources
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show label if slice is too small
    
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
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 md:p-6">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Water Source Statistics</h3>
      
      {/* Summary Numbers */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="flex flex-col items-center p-2 md:p-3 bg-green-50 rounded-lg">
          <Droplet className="w-4 h-4 md:w-5 md:h-5 text-green-600 mb-1" />
          <div className="text-xl md:text-2xl font-bold text-green-700">{stats.working}</div>
          <div className="text-xs text-green-600 font-medium">Working</div>
        </div>
        <div className="flex flex-col items-center p-2 md:p-3 bg-orange-50 rounded-lg">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-600 mb-1" />
          <div className="text-xl md:text-2xl font-bold text-orange-700">{stats.low}</div>
          <div className="text-xs text-orange-600 font-medium">Low Water</div>
        </div>
        <div className="flex flex-col items-center p-2 md:p-3 bg-red-50 rounded-lg">
          <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 mb-1" />
          <div className="text-xl md:text-2xl font-bold text-red-700">{stats.dry}</div>
          <div className="text-xs text-red-600 font-medium">Dry</div>
        </div>
      </div>

      {/* Text Summary */}
      <div className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 text-center font-medium">
        Total: {total} sources • Working: {stats.working} • Low Water: {stats.low} • Dry: {stats.dry}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="w-full" style={{ height: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color, fontSize: "11px" }}>
                    {value}: {entry.payload.value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

