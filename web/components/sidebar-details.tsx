import { WaterSource } from "@/lib/data";
import { X, MapPin, Activity, Calendar, Droplets } from "lucide-react";
import { format } from "date-fns";

interface SidebarDetailsProps {
  source: WaterSource | null;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  working: "text-green-600 bg-green-50",
  low: "text-yellow-600 bg-yellow-50",
  no_water: "text-red-600 bg-red-50",
  broken: "text-gray-600 bg-gray-50",
};

const statusLabels: Record<string, string> = {
  working: "Working",
  low: "Low Water",
  no_water: "No Water",
  broken: "Broken",
};

export default function SidebarDetails({
  source,
  onClose,
}: SidebarDetailsProps) {
  if (!source) return null;

  return (
    <div className="absolute top-4 left-4 z-10 w-80 bg-white rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-left-10 duration-300">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="font-bold text-lg text-gray-800">Source Details</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{source.name}</h3>
          <div className="flex items-center text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{source.village}</span>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg flex items-center space-x-3 ${
            statusColors[source.status] || "text-gray-600 bg-gray-50"
          }`}
        >
          <Activity className="w-5 h-5" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Status
            </p>
            <p className="font-bold">
              {statusLabels[source.status] || source.status}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <p className="text-xs text-gray-400 font-medium">LAST UPDATED</p>
              <p className="text-sm text-gray-700 font-medium">
                {source.last_updated
                  ? format(new Date(source.last_updated), "PP p")
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Droplets className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <p className="text-xs text-gray-400 font-medium">
                ESTIMATED FLOW
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {source.status === "working"
                  ? "Good flow rate"
                  : "Restricted flow"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm active:transform active:scale-95">
            Submit New Report
          </button>
        </div>
      </div>
    </div>
  );
}
