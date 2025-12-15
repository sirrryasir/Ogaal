"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ReportPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    village: "",
    sourceType: "Borehole",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert("Report submitted successfully!");
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 1500);
  };

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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Village / Location
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g. Baligubadle"
              value={formData.village}
              onChange={(e) =>
                setFormData({ ...formData, village: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Water Source Type
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.sourceType}
              onChange={(e) =>
                setFormData({ ...formData, sourceType: e.target.value })
              }
            >
              <option>Borehole</option>
              <option>Dam (Berkad)</option>
              <option>Well</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Report Details
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Describe the issue (e.g. pump broken, water level low, dries up...)"
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
