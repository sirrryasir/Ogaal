import UssdPhone from "@/components/ussd-phone";
import { getWaterSources } from "@/lib/data";
import { Smartphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UssdPage() {
  const sources = await getWaterSources();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Smartphone className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">USSD Simulator</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Experience how non-smartphone users interact with AquaGuard via simple
          text menus.
          <br />
          <span className="font-mono bg-gray-200 px-2 rounded text-sm mt-2 inline-block">
            Dial *123#
          </span>
        </p>
      </div>

      <UssdPhone sources={sources} />
    </div>
  );
}
