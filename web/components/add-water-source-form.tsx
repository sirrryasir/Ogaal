"use client";

import { useState } from "react";
import { addSource } from "@/lib/actions";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddWaterSourceFormProps {
  onClose: () => void;
}

export default function AddWaterSourceForm({ onClose }: AddWaterSourceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await addSource(formData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
          onClose();
        }, 1500);
      } else {
        setError(result.message || "Failed to add water source");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in duration-300">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">Water source added successfully</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-in zoom-in duration-300">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">Add New Water Source</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pb-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Central Borehole"
              />
            </div>

            {/* District */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="district"
                name="district"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Hargeisa"
              />
            </div>

            {/* Village */}
            <div>
              <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-1">
                Village
              </label>
              <input
                type="text"
                id="village"
                name="village"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Sheikh"
              />
            </div>

            {/* Source Type */}
            <div>
              <label htmlFor="source_type" className="block text-sm font-medium text-gray-700 mb-1">
                Source Type <span className="text-red-500">*</span>
              </label>
              <select
                id="source_type"
                name="source_type"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select type</option>
                <option value="WELL">Well</option>
                <option value="BOREHOLE">Borehole</option>
                <option value="BERKAD">Berkad</option>
                <option value="SPRING">Spring</option>
              </select>
            </div>

            {/* Operational Status */}
            <div>
              <label htmlFor="operational_status" className="block text-sm font-medium text-gray-700 mb-1">
                Operational Status <span className="text-red-500">*</span>
              </label>
              <select
                id="operational_status"
                name="operational_status"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select status</option>
                <option value="OPERATIONAL">Operational</option>
                <option value="LIMITED">Limited</option>
                <option value="NON_FUNCTIONAL">Non-Functional</option>
              </select>
            </div>

            {/* Latitude */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                required
                step="any"
                min="-90"
                max="90"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 9.560000"
              />
            </div>

            {/* Longitude */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                required
                step="any"
                min="-180"
                max="180"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 44.065000"
              />
            </div>

            {/* Design Capacity */}
            <div>
              <label htmlFor="design_capacity_liters" className="block text-sm font-medium text-gray-700 mb-1">
                Design Capacity (Liters) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="design_capacity_liters"
                name="design_capacity_liters"
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 50000"
              />
            </div>

            {/* Current Capacity */}
            <div>
              <label htmlFor="current_capacity_liters" className="block text-sm font-medium text-gray-700 mb-1">
                Current Capacity (Liters) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="current_capacity_liters"
                name="current_capacity_liters"
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 45000"
              />
            </div>

            {/* Population Served */}
            <div>
              <label htmlFor="population_served" className="block text-sm font-medium text-gray-700 mb-1">
                Population Served <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="population_served"
                name="population_served"
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 500"
              />
            </div>

            {/* Installation Date */}
            <div>
              <label htmlFor="installation_date" className="block text-sm font-medium text-gray-700 mb-1">
                Installation Date
              </label>
              <input
                type="date"
                id="installation_date"
                name="installation_date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Water Source"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

