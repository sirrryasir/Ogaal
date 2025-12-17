"use client";

import { useState } from "react";
import { Trash2, MapPin, ChevronDown, ChevronRight, Droplet, Eye } from "lucide-react";
import { deleteSource } from "@/lib/actions";
import { WaterSource } from "@/lib/data";
import { useRouter } from "next/navigation";
import VillageDetailView from "./village-detail-view";

function DistrictSection({ 
  district, 
  villages 
}: { 
  district: string; 
  villages: { village: string; sources: WaterSource[] }[] 
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
          <h2 className="text-lg font-bold text-gray-900">{district}</h2>
          <span className="text-sm text-gray-500">
            ({villages.reduce((sum, v) => sum + v.sources.length, 0)} sources)
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="divide-y divide-gray-100">
          {villages.map((villageData, idx) => (
            <VillageSection
              key={idx}
              village={villageData.village}
              sources={villageData.sources}
              district={district}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VillageSection({ 
  village, 
  sources,
  district,
}: { 
  village: string; 
  sources: WaterSource[];
  district: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  const statusCounts = {
    working: sources.filter(s => s.status?.toLowerCase().includes('working') || s.status?.toLowerCase().includes('operational')).length,
    limited: sources.filter(s => s.status?.toLowerCase().includes('limited') || s.status?.toLowerCase().includes('maintenance')).length,
    broken: sources.filter(s => s.status?.toLowerCase().includes('broken') || s.status?.toLowerCase().includes('non')).length,
  };

  return (
    <div className="bg-gray-50">
      <div className="w-full px-6 py-3 hover:bg-gray-100 transition-colors flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <MapPin className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => setShowDetail(true)}
            className="font-semibold text-gray-700 hover:text-blue-600 transition-colors text-left"
          >
            {village}
          </button>
          <span className="text-xs text-gray-500">
            ({sources.length} sources)
          </span>
          <div className="flex gap-2 ml-4">
            {statusCounts.working > 0 && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                {statusCounts.working} Working
              </span>
            )}
            {statusCounts.limited > 0 && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                {statusCounts.limited} Limited
              </span>
            )}
            {statusCounts.broken > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                {statusCounts.broken} Broken
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowDetail(true)}
          className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          title="View village details"
        >
          <Eye className="w-3 h-3" />
          Details
        </button>
      </div>

      {isOpen && (
        <div className="px-6 py-4 space-y-3 bg-white">
          <div className="mb-3 flex justify-end">
            <button
              onClick={() => setShowDetail(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
          {sources.map((source) => (
            <WaterSourceCard key={source.id} source={source} />
          ))}
        </div>
      )}

      {showDetail && (
        <VillageDetailView
          village={village}
          district={district}
          sources={sources}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}

function WaterSourceCard({ source }: { source: WaterSource }) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("working") || s.includes("operational")) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (s.includes("limited") || s.includes("maintenance")) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    if (s.includes("broken") || s.includes("non")) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  async function handleDelete() {
    await deleteSource(source.id);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Droplet className="w-4 h-4 text-blue-500" />
          <h4 className="font-bold text-gray-900">{source.name}</h4>
          {source.type && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {source.type}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="text-xs font-mono">
            {source.lat.toFixed(4)}, {source.lng.toFixed(4)}
          </span>
          {source.water_level !== undefined && (
            <span className="text-xs">
              Water Level: {source.water_level}%
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(
            source.status
          )}`}
        >
          {source.status?.replace(/_/g, " ") || "Unknown"}
        </span>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-600 p-1 transition-colors"
          title="Delete source"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface DistrictViewProps {
  districts: { district: string; villages: { village: string; sources: WaterSource[] }[] }[];
}

export default function DistrictView({ districts }: DistrictViewProps) {
  return (
    <div className="space-y-4">
      {districts.map((districtData) => (
        <DistrictSection
          key={districtData.district}
          district={districtData.district}
          villages={districtData.villages}
        />
      ))}

      {districts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No water sources found. Add your first source to get started.</p>
        </div>
      )}
    </div>
  );
}

