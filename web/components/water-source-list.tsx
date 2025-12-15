import { WaterSource } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface WaterSourceListProps {
  sources: WaterSource[];
  onSelect: (source: WaterSource) => void;
  selectedId: number | null;
}

const statusColors: Record<string, string> = {
  working: "bg-green-100 text-green-700",
  low: "bg-yellow-100 text-yellow-700",
  no_water: "bg-red-100 text-red-700",
  broken: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  working: "Working",
  low: "Low",
  no_water: "Dry",
  broken: "Broken",
};

export default function WaterSourceList({
  sources,
  onSelect,
  selectedId,
}: WaterSourceListProps) {
  return (
    <div className="space-y-3">
      {sources.map((source) => (
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
                statusColors[source.status] || "bg-gray-100 text-gray-700"
              )}
            >
              {statusLabels[source.status] || source.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
