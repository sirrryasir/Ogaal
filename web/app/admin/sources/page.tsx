import { addSource, deleteSource } from "@/lib/actions";
import { getWaterSources } from "@/lib/data";
import { Plus, Trash2, MapPin } from "lucide-react";

export default async function AdminSourcesPage() {
  const sources = await getWaterSources();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Water Sources
        </h1>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Source</span>
        </button>
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
                  source.status === "working"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {source.status.replace("_", " ")}
              </span>
              <form
                action={async () => {
                  "use server";
                  await deleteSource(source.id);
                }}
              >
                <button className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
