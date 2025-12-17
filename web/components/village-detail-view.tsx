"use client";

import { useState } from "react";
import { X, MapPin, Droplet, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { WaterSource } from "@/lib/data";
import { deleteSource } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface VillageDetailViewProps {
  village: string;
  district: string;
  sources: WaterSource[];
  onClose: () => void;
}

export default function VillageDetailView({
  village,
  district,
  sources,
  onClose,
}: VillageDetailViewProps) {
  const router = useRouter();

  const statusCounts = {
    working: sources.filter(
      (s) =>
        s.status?.toLowerCase().includes("working") ||
        s.status?.toLowerCase().includes("operational")
    ).length,
    limited: sources.filter(
      (s) =>
        s.status?.toLowerCase().includes("limited") ||
        s.status?.toLowerCase().includes("maintenance")
    ).length,
    broken: sources.filter(
      (s) =>
        s.status?.toLowerCase().includes("broken") ||
        s.status?.toLowerCase().includes("non")
    ).length,
  };

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

  async function handleDelete(sourceId: number) {
    await deleteSource(sourceId);
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6" />
                <h2 className="text-2xl font-bold">{village}</h2>
              </div>
              <p className="text-blue-100 text-sm">{district} District</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Village Statistics */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{sources.length}</div>
              <div className="text-xs text-gray-500 font-medium">Total Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{statusCounts.working}</div>
              <div className="text-xs text-gray-500 font-medium">Working</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">{statusCounts.limited}</div>
              <div className="text-xs text-gray-500 font-medium">Limited</div>
            </div>
          </div>
        </div>

        {/* Water Sources List */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-600" />
            <span>Water Sources</span>
            <span className="text-gray-500 font-normal">({sources.length})</span>
          </h3>

          {sources.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No water sources found for this village.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Droplet className="w-5 h-5 text-blue-500" />
                        <h4 className="font-bold text-gray-900 text-lg">{source.name}</h4>
                        {source.type && (
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                            {source.type}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-xs">
                            {source.lat.toFixed(6)}, {source.lng.toFixed(6)}
                          </span>
                        </div>

                        {source.water_level !== undefined && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Droplet className="w-4 h-4 text-blue-400" />
                            <span>Water Level: {source.water_level}%</span>
                          </div>
                        )}

                        {source.last_updated && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-xs">
                              Last Updated:{" "}
                              {new Date(source.last_updated).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase border ${getStatusColor(
                          source.status
                        )}`}
                      >
                        {source.status?.replace(/_/g, " ") || "Unknown"}
                      </span>
                      <button
                        onClick={() => handleDelete(source.id)}
                        className="text-red-400 hover:text-red-600 p-1 transition-colors"
                        title="Delete source"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

