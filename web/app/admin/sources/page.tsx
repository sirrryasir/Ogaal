export const dynamic = "force-dynamic";

import { deleteSource } from "@/lib/actions";
import { getWaterSources, getVillages, WaterSource } from "@/lib/data";
import DistrictView from "@/components/district-view";
import AddSourceDialog from "./add-source-dialog";

export default async function AdminSourcesPage() {
  const [sources, villages] = await Promise.all([
    getWaterSources(),
    getVillages(),
  ]);

  // Group sources by district and village
  const groupedData: Record<
    string,
    Record<string, WaterSource[]>
  > = {};

  sources.forEach((source) => {
    const district = source.district || "Unknown District";
    const village = source.village || "Unknown Village";

    if (!groupedData[district]) {
      groupedData[district] = {};
    }
    if (!groupedData[district][village]) {
      groupedData[district][village] = [];
    }
    groupedData[district][village].push(source);
  });

  // Convert to array format for rendering
  const districts = Object.entries(groupedData).map(([district, villages]) => ({
    district,
    villages: Object.entries(villages).map(([village, sources]) => ({
      village,
      sources,
    })),
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Water Sources
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {sources.length} total water sources across {districts.length} districts
          </p>
        </div>
        <AddSourceDialog villages={villages} />
      </div>

      <DistrictView districts={districts} />
    </div>
  );
}
