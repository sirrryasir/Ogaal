"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getWaterSources, WaterSource } from "@/lib/data";
import { Loader2 } from "lucide-react";

// Dynamically import WaterSourceStatistics to avoid SSR issues with recharts
const WaterSourceStatistics = dynamic(
  () => import("@/components/water-source-statistics"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    ),
  }
);

export default function StatisticsPage() {
  const [sources, setSources] = useState<WaterSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSources() {
      try {
        const data = await getWaterSources();
        setSources(data);
      } catch (err) {
        console.error("Failed to fetch sources", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Water Source Statistics
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Comprehensive overview of all registered water sources
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <WaterSourceStatistics sources={sources} />
        )}
      </div>
    </div>
  );
}

