"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getVillages,
  getWaterSources,
  submitReport,
  Village,
  WaterSource,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const ReportPage = () => {
  const router = useRouter();
  const [villages, setVillages] = useState<Village[]>([]);
  const [allSources, setAllSources] = useState<WaterSource[]>([]);
  const [filteredSources, setFilteredSources] = useState<WaterSource[]>([]);

  const [formData, setFormData] = useState({
    villageId: "",
    sourceId: "", // Water Source ID
    status: "Working", // Default status
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [v, s] = await Promise.all([getVillages(), getWaterSources()]);
        setVillages(v);
        setAllSources(s);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter sources when village changes
  useEffect(() => {
    if (formData.villageId) {
      const vId = parseInt(formData.villageId);
      const filtered = allSources.filter((s) => s.village_id === vId);
      setFilteredSources(filtered);
      // Reset source selection when village changes
      setFormData((prev) => ({ ...prev, sourceId: "" }));
    } else {
      setFilteredSources([]);
    }
  }, [formData.villageId, allSources]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.villageId || !formData.sourceId) {
      alert("Please select a village and a water source.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReport({
        village_id: parseInt(formData.villageId),
        water_source_id: parseInt(formData.sourceId),
        report_content: `[Status: ${formData.status}] ${formData.content}`,
        reporter_type: "WEB_USER",
      });
      alert("Report submitted successfully!");
      // Reset form instead of redirecting
      setFormData({
        villageId: "",
        sourceId: "",
        status: "Working",
        content: "",
      });
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg border border-slate-100 p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Submit Report</h1>
          <p className="text-slate-500 text-sm">
            Help us track drought conditions in your area.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Village Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Village / Location
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.villageId}
              onChange={(e) =>
                setFormData({ ...formData, villageId: e.target.value })
              }
            >
              <option value="">Select Village</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Water Source Selection (Dependent) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Water Source
            </label>
            <select
              required
              disabled={!formData.villageId}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
              value={formData.sourceId}
              onChange={(e) =>
                setFormData({ ...formData, sourceId: e.target.value })
              }
            >
              <option value="">
                {formData.villageId
                  ? "Select Water Source"
                  : "Select Village First"}
              </option>
              {filteredSources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status})
                </option>
              ))}
            </select>
          </div>

          {/* Status Selection (Fixed Options) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
              Current Status
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  value: "Working",
                  label: "Water Available (Working)",
                  color: "border-green-200 bg-green-50 text-green-800",
                },
                {
                  value: "Low Water",
                  label: "Water Level Low",
                  color: "border-yellow-200 bg-yellow-50 text-yellow-800",
                },
                {
                  value: "Broken",
                  label: "Pump Broken / No Access",
                  color: "border-red-200 bg-red-50 text-red-800",
                },
                {
                  value: "Other",
                  label: "Other Issue",
                  color: "border-gray-200 bg-gray-50 text-gray-800",
                },
              ].map((option) => (
                <label key={option.value} className="relative cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={formData.status === option.value}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Additional Details
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Describe the issue... "
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Submit Report"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full text-slate-500 hover:text-slate-700 text-sm py-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;
