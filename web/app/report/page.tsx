"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getRegions,
  getDistricts,
  getVillages,
  getWaterSources,
  submitReport,
  Region,
  District,
  Village,
  WaterSource,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";
import {
  MapPin,
  Droplet,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

const ReportPage = () => {
  const router = useRouter();
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [allSources, setAllSources] = useState<WaterSource[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);
  const [filteredSources, setFilteredSources] = useState<WaterSource[]>([]);

  const [formData, setFormData] = useState({
    regionId: "",
    districtId: "",
    villageId: "",
    sourceId: "",
    status: "WORKING",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Status options with icons and colors
  const statusOptions = [
    {
      value: "WORKING",
      label: "Working - Water Available",
      description: "Source is working properly with sufficient water",
      icon: CheckCircle,
      color: "border-green-200 bg-green-50 hover:bg-green-100 text-green-800",
      activeColor: "border-green-500 bg-green-100 ring-2 ring-green-300",
    },
    {
      value: "BROKEN",
      label: "Broken - Not Functioning",
      description: "Source is broken and not providing water",
      icon: XCircle,
      color: "border-red-200 bg-red-50 hover:bg-red-100 text-red-800",
      activeColor: "border-red-500 bg-red-100 ring-2 ring-red-300",
    },
    {
      value: "DRY",
      label: "Dry - No Water",
      description: "Source is completely dry",
      icon: XCircle,
      color:
        "border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-800",
      activeColor: "border-orange-500 bg-orange-100 ring-2 ring-orange-300",
    },
    {
      value: "LOW_WATER",
      label: "Low Water - Reduced Supply",
      description: "Water available but at low levels",
      icon: AlertCircle,
      color:
        "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-800",
      activeColor: "border-yellow-500 bg-yellow-100 ring-2 ring-yellow-300",
    },
    {
      value: "CONTAMINATION",
      label: "Contamination - Unsafe",
      description: "Water is contaminated and unsafe for drinking",
      icon: XCircle,
      color:
        "border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800",
      activeColor: "border-purple-500 bg-purple-100 ring-2 ring-purple-300",
    },
  ];

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [regionsData, districtsData, villagesData, sourcesData] =
          await Promise.all([
            getRegions(),
            getDistricts(),
            getVillages(),
            getWaterSources(),
          ]);

        setRegions(regionsData);
        setDistricts(districtsData);
        setVillages(villagesData);
        setAllSources(sourcesData);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter districts when region changes
  useEffect(() => {
    if (formData.regionId) {
      const regionId = parseInt(formData.regionId);
      const filtered = districts.filter((d) => d.region_id === regionId);
      setFilteredDistricts(filtered);

      // Reset downstream selections
      setFormData((prev) => ({
        ...prev,
        districtId: "",
        villageId: "",
        sourceId: "",
      }));
      setFilteredVillages([]);
      setFilteredSources([]);
    } else {
      setFilteredDistricts([]);
    }
  }, [formData.regionId, districts]);

  // Filter villages when district changes
  useEffect(() => {
    if (formData.districtId) {
      const districtId = parseInt(formData.districtId);
      const filtered = villages.filter((v) => v.district_id === districtId);
      setFilteredVillages(filtered);

      // Reset downstream selections
      setFormData((prev) => ({
        ...prev,
        villageId: "",
        sourceId: "",
      }));
      setFilteredSources([]);
    } else {
      setFilteredVillages([]);
    }
  }, [formData.districtId, villages]);

  // Filter sources when village changes
  useEffect(() => {
    if (formData.villageId) {
      const villageId = parseInt(formData.villageId);
      const filtered = allSources.filter((s) => s.village_id === villageId);
      setFilteredSources(filtered);

      // Reset source selection
      setFormData((prev) => ({ ...prev, sourceId: "" }));
    } else {
      setFilteredSources([]);
    }
  }, [formData.villageId, allSources]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.villageId || !formData.sourceId || !formData.status) {
      alert("Please select a location and water source, then choose a status.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReport({
        village_id: parseInt(formData.villageId),
        water_source_id: parseInt(formData.sourceId),
        content: formData.content,
        reporter_type: "WEB_USER",
        status: formData.status,
      });
      alert("Report submitted successfully!");
      // Reset form
      setFormData({
        regionId: "",
        districtId: "",
        villageId: "",
        sourceId: "",
        status: "WORKING",
        content: "",
      });
      setFilteredDistricts([]);
      setFilteredVillages([]);
      setFilteredSources([]);
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Submit Water Source Report</h1>
            </div>
            <p className="text-blue-100">
              Help monitor water availability in Somaliland. Select your
              location and report the current status.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hierarchical Location Selection with Dropdowns */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                    1
                  </span>
                  Select Location
                </h2>

                {/* Location Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Region Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 z-10" />
                      <select
                        required
                        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer"
                        value={formData.regionId}
                        onChange={(e) =>
                          setFormData({ ...formData, regionId: e.target.value })
                        }
                      >
                        <option value="">Select Region</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* District Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      District <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 z-10" />
                      <select
                        required
                        disabled={!formData.regionId}
                        className={cn(
                          "w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none",
                          formData.regionId
                            ? "bg-white cursor-pointer"
                            : "bg-slate-100 cursor-not-allowed"
                        )}
                        value={formData.districtId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            districtId: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          {formData.regionId
                            ? "Select District"
                            : "Select Region First"}
                        </option>
                        {filteredDistricts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Village Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Village <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500 z-10" />
                      <select
                        required
                        disabled={!formData.districtId}
                        className={cn(
                          "w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none",
                          formData.districtId
                            ? "bg-white cursor-pointer"
                            : "bg-slate-100 cursor-not-allowed"
                        )}
                        value={formData.villageId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            villageId: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          {formData.districtId
                            ? "Select Village"
                            : "Select District First"}
                        </option>
                        {filteredVillages.map((village) => (
                          <option key={village.id} value={village.id}>
                            {village.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Selected Location Summary */}
                {(formData.regionId ||
                  formData.districtId ||
                  formData.villageId) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-2">
                    <h3 className="font-medium text-blue-800 mb-1">
                      Selected Location:
                    </h3>
                    <div className="flex items-center text-blue-700">
                      {formData.regionId && (
                        <span className="font-semibold bg-blue-100 px-3 py-1 rounded-lg">
                          {
                            regions.find(
                              (r) => r.id === parseInt(formData.regionId)
                            )?.name
                          }
                        </span>
                      )}
                      {formData.districtId && (
                        <>
                          <span className="mx-2 text-blue-400">→</span>
                          <span className="font-semibold bg-green-100 px-3 py-1 rounded-lg">
                            {
                              districts.find(
                                (d) => d.id === parseInt(formData.districtId)
                              )?.name
                            }
                          </span>
                        </>
                      )}
                      {formData.villageId && (
                        <>
                          <span className="mx-2 text-blue-400">→</span>
                          <span className="font-semibold bg-purple-100 px-3 py-1 rounded-lg">
                            {
                              villages.find(
                                (v) => v.id === parseInt(formData.villageId)
                              )?.name
                            }
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Water Source Selection */}
              {formData.villageId && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      2
                    </span>
                    Select Water Source
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Water Source <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500 z-10" />
                      <select
                        required
                        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer"
                        value={formData.sourceId}
                        onChange={(e) =>
                          setFormData({ ...formData, sourceId: e.target.value })
                        }
                      >
                        <option value="">Select a Water Source</option>
                        {filteredSources.map((source) => (
                          <option key={source.id} value={source.id}>
                            {source.name} ({source.source_type}) - Currently:{" "}
                            {source.status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    {filteredSources.length === 0 && formData.villageId && (
                      <p className="text-sm text-slate-500 mt-2">
                        No water sources found in this village. Please select a
                        different village.
                      </p>
                    )}

                    {/* Selected Water Source Details */}
                    {formData.sourceId && (
                      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <h4 className="font-medium text-slate-800 mb-2">
                          Selected Water Source:
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-slate-600">Name:</span>
                            <span className="font-medium ml-2">
                              {
                                filteredSources.find(
                                  (s) => s.id === parseInt(formData.sourceId)
                                )?.name
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Type:</span>
                            <span className="font-medium ml-2 capitalize">
                              {filteredSources
                                .find(
                                  (s) => s.id === parseInt(formData.sourceId)
                                )
                                ?.source_type?.toLowerCase()}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">
                              Current Status:
                            </span>
                            <span
                              className={cn(
                                "font-medium ml-2 px-2 py-1 rounded-full text-xs capitalize",
                                filteredSources.find(
                                  (s) => s.id === parseInt(formData.sourceId)
                                )?.status === "functional"
                                  ? "bg-green-100 text-green-800"
                                  : filteredSources.find(
                                      (s) =>
                                        s.id === parseInt(formData.sourceId)
                                    )?.status === "needs_repair"
                                  ? "bg-orange-100 text-orange-800"
                                  : filteredSources.find(
                                      (s) =>
                                        s.id === parseInt(formData.sourceId)
                                    )?.status === "alaw_water"
                                  ? "bg-blue-100 text-blue-800"
                                  : filteredSources.find(
                                      (s) =>
                                        s.id === parseInt(formData.sourceId)
                                    )?.status === "contaminated"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-red-100 text-red-800"
                              )}
                            >
                              {filteredSources
                                .find(
                                  (s) => s.id === parseInt(formData.sourceId)
                                )
                                ?.status?.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Selection */}
              {formData.sourceId && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      3
                    </span>
                    Report Status
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Current Status <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {statusOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <label
                            key={option.value}
                            className="relative cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="status"
                              value={option.value}
                              checked={formData.status === option.value}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  status: e.target.value,
                                })
                              }
                              className="peer sr-only"
                            />
                            <div
                              className={cn(
                                "p-4 rounded-xl border-2 transition-all h-full flex flex-col items-center text-center",
                                "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                                formData.status === option.value
                                  ? option.activeColor
                                  : option.color
                              )}
                            >
                              <div className="mb-3">
                                <div
                                  className={cn(
                                    "p-3 rounded-full",
                                    formData.status === option.value
                                      ? "bg-white"
                                      : "bg-white/80"
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      "w-6 h-6",
                                      formData.status === option.value
                                        ? option.color
                                            .split(" ")[2]
                                            .replace("text-", "text-")
                                        : option.color.split(" ")[2]
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="font-semibold mb-1">
                                {option.label.split(" - ")[0]}
                              </div>
                              <div className="text-xs opacity-75">
                                {option.label.split(" - ")[1]}
                              </div>
                              <div className="text-xs mt-2 opacity-60">
                                {option.description}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {formData.status && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                      4
                    </span>
                    Additional Details
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Observations & Comments
                    </label>
                    <div className="relative">
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Provide additional details about the water source condition, such as water quality, quantity, equipment issues, or any other observations..."
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                      />
                      <div className="text-xs text-slate-500 mt-2">
                        Tip: Include details about water level, color, smell, or
                        any visible issues with the source.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !formData.villageId || !formData.sourceId
                    }
                    className={cn(
                      "flex-1 py-4 rounded-xl font-semibold text-lg transition-all",
                      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                      "disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed",
                      "shadow-lg hover:shadow-xl active:scale-[0.99]",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submit
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-4 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-xs text-slate-500">
                    Your report will help improve water resource management in
                    Somaliland.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReportPage;
