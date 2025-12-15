"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, CloudRain, Thermometer } from "lucide-react";
import DroughtChart from "@/components/drought-chart";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface DroughtData {
  village: string;
  riskLevel: "Low" | "Medium" | "High" | "Severe";
  rainfall: number;
  temp: number;
  message: string;
  reports: number;
}

export default function DroughtAlertsPage() {
  const [data, setData] = useState<DroughtData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/ai/drought", { method: "POST" });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Severe":
        return "bg-red-500 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-400 text-gray-900";
      default:
        return "bg-green-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Drought Early Warning
            </h1>
            <p className="text-gray-500">AI-Powered Risk Analysis</p>
          </div>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl shadow-sm">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">
              Analyzing satellite weather data...
            </p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Main Alert Card */}
            <div
              className={`p-8 rounded-3xl shadow-lg transition-all transform hover:scale-[1.01] ${
                data.riskLevel === "Severe"
                  ? "bg-red-50 border-2 border-red-100"
                  : "bg-white"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-4 py-1 rounded-full font-bold uppercase tracking-wide text-sm ${getRiskColor(
                        data.riskLevel
                      )}`}
                    >
                      {data.riskLevel} Risk
                    </span>
                    <span className="text-gray-400 text-sm">
                      Hargeisa Region
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {data.riskLevel === "Severe"
                      ? "Immediate Action Required"
                      : "Status Overview"}
                  </h2>
                  <p className="text-lg text-gray-700 italic max-w-2xl">
                    "{data.message}"
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-2xl flex items-center justify-center min-w-[120px]">
                  <AlertTriangle
                    className={`w-12 h-12 ${
                      data.riskLevel === "Severe"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                    <CloudRain className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Weekly Rainfall
                  </h3>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {data.rainfall.toFixed(1)}
                  </span>
                  <span className="text-gray-500 mb-1">mm</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Last 7 days accumulation
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                    <Thermometer className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Community Signals
                  </h3>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {data.reports}
                  </span>
                  <span className="text-gray-500 mb-1">reports</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  "Low Water" reports this week
                </p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <h3 className="font-bold text-gray-900 text-xl mb-6">
                Risk Trend Analysis
              </h3>
              <DroughtChart />
            </div>
          </div>
        ) : (
          <div className="bg-red-50 p-8 rounded-3xl text-center text-red-600">
            Failed to load analysis.
          </div>
        )}
      </div>
    </div>
  );
}
