"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getWaterSources, WaterSource } from "@/lib/data";
import SidebarDetails from "@/components/sidebar-details";
import WaterSourceList from "@/components/water-source-list";
import { LayoutGrid, Map as MapIcon, Loader2 } from "lucide-react";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ),
});

export default function WaterSourcesPage() {
  const [sources, setSources] = useState<WaterSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
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
    <div className="h-screen w-full flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      {/* Mobile Toggle & Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b z-20 shadow-sm shrink-0">
        <h1 className="font-bold text-lg text-blue-600">Ogaal Monitor</h1>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("map")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "map"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            <MapIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col md:flex-row h-full overflow-hidden">
        {/* Map Container */}
        <div
          className={`
          absolute inset-0 z-0 h-full w-full transition-transform duration-300 md:relative md:flex-1
          ${
            viewMode === "list"
              ? "translate-x-full md:translate-x-0"
              : "translate-x-0"
          }
        `}
        >
          <MapView
            sources={sources}
            onSelectSource={(s) => {
              setSelectedSource(s);
              // On mobile, maybe snap to detail?
            }}
            selectedSourceId={selectedSource?.id}
          />

          <SidebarDetails
            source={selectedSource}
            onClose={() => setSelectedSource(null)}
          />
        </div>

        {/* List Container (Sidebar on Desktop, Full on Mobile) */}
        <div
          className={`
           absolute inset-0 z-10 bg-gray-50 transition-transform duration-300 overflow-y-auto
           md:relative md:w-96 md:border-l md:border-gray-200 md:translate-x-0
           ${
             viewMode === "map"
               ? "translate-x-full md:translate-x-0"
               : "translate-x-0"
           }
        `}
        >
          <div className="p-4 md:p-6 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Water Sources</h2>
            <p className="text-sm text-gray-500 mt-1">
              {sources.length} locations monitored
            </p>
          </div>

          <div className="p-4 md:p-6 pb-20">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <WaterSourceList
                sources={sources}
                onSelect={(s) => {
                  setSelectedSource(s);
                  if (window.innerWidth < 768) setViewMode("map");
                }}
                selectedId={selectedSource?.id || null}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
