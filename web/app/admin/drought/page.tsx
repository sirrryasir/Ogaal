import { AlertOctagon } from "lucide-react";

export default function AdminDroughtPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        AI Predictions Log
      </h1>
      <div className="bg-white p-8 text-center rounded-xl border border-gray-200">
        <AlertOctagon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">System Logs</h3>
        <p className="text-gray-500">
          View real-time AI decision logs here. (Connected to DB)
        </p>
        {/* List logs from mock or DB */}
      </div>
    </div>
  );
}
