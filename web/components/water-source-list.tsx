import { useState, useMemo } from "react";
import { WaterSource } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MapPin, Search } from "lucide-react";

interface WaterSourceListProps {
  sources: WaterSource[];
  onSelect: (source: WaterSource) => void;
  selectedId: number | null;
}

const statusColors: Record<string, string> = {
  working: "bg-green-100 text-green-700",
  low: "bg-yellow-100 text-yellow-700",
  dry: "bg-red-100 text-red-700",
  broken: "bg-black text-white",
  contaminated: "bg-purple-100 text-purple-700",
};

const statusLabels: Record<string, string> = {
  working: "Working",
  low: "Low Water",
  dry: "Dry",
  broken: "Broken",
  contaminated: "Contaminated",
};

export default function WaterSourceList({
  sources,
  onSelect,
  selectedId,
}: WaterSourceListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.village.toLowerCase().includes(search.toLowerCase());

      if (filter === "all") return matchesSearch;

      const status = s.status?.toLowerCase() || "";
      return matchesSearch && status.includes(filter);
    });
  }, [sources, search, filter]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="space-y-2 sticky top-0 bg-gray-50 z-10 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sources or villages..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="working">Working</option>
          <option value="low">Low</option>
          <option value="dry">Dry</option>
          <option value="broken">Broken</option>
          <option value="contaminated">Contaminated</option>
        </select>
        <div className="text-xs text-gray-500 px-1">
          Showing {filteredSources.length} results
        </div>
      </div>

      <div className="space-y-3">
        {filteredSources.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No water sources found.
          </div>
        ) : (
          filteredSources.map((source) => (
            <div
              key={source.id}
              onClick={() => onSelect(source)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md bg-white",
                selectedId === source.id
                  ? "border-blue-500 ring-1 ring-blue-500 shadow-md"
                  : "border-gray-200"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{source.name}</h3>
                  <div className="flex items-center text-gray-500 mt-1 text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{source.village}</span>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    statusColors[source.status?.toLowerCase()] ||
                      "bg-gray-100 text-gray-700"
                  )}
                >
                  {statusLabels[source.status?.toLowerCase()] || source.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
