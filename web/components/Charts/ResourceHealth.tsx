"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Borehole A", level: 85 },
  { name: "Dam B", level: 40 },
  { name: "Well C", level: 20 },
  { name: "Borehole D", level: 90 },
  { name: "Dam E", level: 10 },
];

const ResourceHealth = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-64">
      <h2 className="text-lg font-semibold mb-2">Water Levels (%)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="level" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.level < 30
                    ? "#ef4444"
                    : entry.level < 60
                    ? "#f97316"
                    : "#22c55e"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceHealth;
