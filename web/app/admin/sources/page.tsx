export const dynamic = "force-dynamic";

import { deleteSource } from "@/lib/actions";
import { getWaterSources, getVillages } from "@/lib/data";
import { MapPin } from "lucide-react";
import AddSourceDialog from "./add-source-dialog";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminSourcesPage() {
  const [sources, villages] = await Promise.all([
    getWaterSources(),
    getVillages(),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Water Sources
        </h1>
        <AddSourceDialog villages={villages} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sources.map((source) => (
          <div
            key={source.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start"
          >
            <div>
              <h3 className="font-bold text-gray-900">{source.name}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1 mb-3">
                <MapPin className="w-3 h-3 mr-1" />
                {source.village}
              </div>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                {source.lat.toFixed(4)}, {source.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                  source.status === "working" || source.status === "Working"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {source.status.replace("_", " ")}
              </span>
              <DeleteButton
                action={async () => {
                  "use server";
                  await deleteSource(source.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
