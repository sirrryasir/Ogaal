"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", risk: 20, rain: 5 },
  { name: "Tue", risk: 25, rain: 4 },
  { name: "Wed", risk: 30, rain: 2 },
  { name: "Thu", risk: 45, rain: 0 },
  { name: "Fri", risk: 60, rain: 0 },
  { name: "Sat", risk: 75, rain: 0 },
  { name: "Sun", risk: 85, rain: 0 },
];

export default function DroughtChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E2E8F0"
          />
          <XAxis
            dataKey="name"
            fontSize={12}
            stroke="#64748B"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            fontSize={12}
            stroke="#64748B"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Risk Score"
          />
          <Line
            type="monotone"
            dataKey="rain"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Rainfall (mm)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
