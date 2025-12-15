"use client";

import { useEffect, useState } from "react";

const InterventionLog = () => {
  // Mock Data (replace with fetch /api/interventions)
  const [interventions] = useState([
    {
      id: 1,
      ngo: "Red Cross",
      type: "Water Trucking",
      location: "Village A",
      status: "In Progress",
      date: "2025-12-10",
    },
    {
      id: 2,
      ngo: "Save the Children",
      type: "Food Distribution",
      location: "Village B",
      status: "Planned",
      date: "2025-12-15",
    },
    {
      id: 3,
      ngo: "Oxfam",
      type: "Borehole Repair",
      location: "Borehole 1",
      status: "Completed",
      date: "2025-12-05",
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-semibold text-lg text-slate-800">
          NGO Intervention Log
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-4 py-3">NGO</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {item.ngo}
                </td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3 text-slate-500">{item.location}</td>
                <td className="px-4 py-3 text-slate-500">{item.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${
                                          item.status === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : item.status === "In Progress"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-slate-100 text-slate-600"
                                        }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterventionLog;
