"use client";

import { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Assuming shadcn or similar exists, using basic div for now
import dynamic from "next/dynamic";
import InterventionLog from "@/components/Dashboard/InterventionLog";

// Leaflet needs to run client-side only
const DroughtMap = dynamic(() => import("@/components/Map/DroughtMap"), {
  ssr: false,
});

interface Village {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  drought_risk_level: string;
  district: { name: string };
}

interface WaterSource {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  status: string;
  water_level: number;
}

export default function DashboardPage() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [waterSources, setWaterSources] = useState<WaterSource[]>([]);

  useEffect(() => {
    // In real app, fetch from /api/villages (would need to create this endpoint)
    setVillages([
      {
        id: 1,
        name: "Village A",
        latitude: 9.56,
        longitude: 44.065,
        drought_risk_level: "High",
        district: { name: "Maroodi Jeex" },
      },
      {
        id: 2,
        name: "Village B",
        latitude: 9.8,
        longitude: 43.5,
        drought_risk_level: "Severe",
        district: { name: "Awdal" },
      },
      {
        id: 3,
        name: "Village C",
        latitude: 9.2,
        longitude: 45.0,
        drought_risk_level: "Low",
        district: { name: "Togdheer" },
      },
    ]);

    // Fetch from backend
    // fetch('http://localhost:3000/api/water-sources')
    //   .then(res => res.json())
    //   .then(data => setWaterSources(data));
    setWaterSources([
      {
        id: 1,
        name: "Borehole 1",
        latitude: 9.57,
        longitude: 44.07,
        type: "Borehole",
        status: "Working",
        water_level: 80,
      },
      {
        id: 2,
        name: "Dam 2",
        latitude: 9.81,
        longitude: 43.51,
        type: "Dam",
        status: "Low",
        water_level: 20,
      },
    ]);
  }, []);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        National Drought Dashboard
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">
            Villages at Risk
          </h3>
          <p className="text-2xl font-bold text-red-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">
            Active Interventions
          </h3>
          <p className="text-2xl font-bold text-blue-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">
            Water Sources Critical
          </h3>
          <p className="text-2xl font-bold text-orange-500">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Reports (24h)</h3>
          <p className="text-2xl font-bold text-slate-900">42</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Risk Map</h2>
          <div className="flex-1 rounded-lg overflow-hidden border border-slate-200">
            <DroughtMap villages={villages} waterSources={waterSources} />
          </div>
        </div>

        {/* Sidebar / Recent Reports */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 overflow-y-auto flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Live Alerts</h2>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md"
                >
                  <p className="text-sm font-bold text-red-800">
                    Severe Drought Warning
                  </p>
                  <p className="text-xs text-red-600">
                    Village {i} - 2 mins ago
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Log */}
      <InterventionLog />
    </div>
  );
}
