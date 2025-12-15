"use client";

import { useState } from "react";
import { submitReport } from "@/lib/actions";
import { WaterSource } from "@/lib/data";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// We pass sources to the form to allow selection
export default function ReportForm({ sources }: { sources: WaterSource[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const res = await submitReport(formData);

    setLoading(false);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.message || "Something went wrong");
    }
  }

  if (success) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-2xl animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Mahadsanid!</h3>
        <p className="text-gray-600 mb-6">
          Your report has been received and helps the whole community.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Water Source
        </label>
        <select
          name="sourceId"
          required
          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
        >
          <option value="">Choose a location...</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} - {s.village}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Status
        </label>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              value: "working",
              label: "Working Properly",
              color: "border-green-200 bg-green-50 text-green-800",
            },
            {
              value: "low",
              label: "Water Level Low",
              color: "border-yellow-200 bg-yellow-50 text-yellow-800",
            },
            {
              value: "no_water",
              label: "No Water Available",
              color: "border-red-200 bg-red-50 text-red-800",
            },
            {
              value: "broken",
              label: "Pump Broken / Damage",
              color: "border-gray-200 bg-gray-50 text-gray-800",
            },
          ].map((option) => (
            <label key={option.value} className="relative cursor-pointer group">
              <input
                type="radio"
                name="status"
                value={option.value}
                required
                className="peer sr-only"
              />
              <div
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center font-medium",
                  "hover:shadow-md peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-blue-500 peer-checked:border-transparent",
                  option.color
                )}
              >
                {option.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          name="note"
          rows={3}
          placeholder="Describe the issue..."
          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {error && (
        <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          "Submit Report"
        )}
      </button>
    </form>
  );
}
