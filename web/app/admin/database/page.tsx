"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
  MapPin,
  Droplet,
  X,
  Calendar,
  AlertCircle,
  CheckCircle,
  Wrench,
} from "lucide-react";
import api from "@/lib/api";

interface WaterSource {
  id: number;
  name: string;
  type: string;
  status: string;
  water_level: number;
  last_maintained: string;
  village: {
    name: string;
    district: {
      name: string;
      region: {
        name: string;
      };
    };
  };
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function DatabasePage() {
  const [data, setData] = useState<WaterSource[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [selectedWaterSource, setSelectedWaterSource] = useState<WaterSource | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("");

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenActionId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch data
  const fetchData = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
        region,
        district,
        status,
      });

      const response = await api.get(`/water-sources?${params}`);
      // Handle both new paginated response and potential old array response fallback
      if (response.data.data) {
        setData(response.data.data);
        setMeta(response.data.meta);
      } else if (Array.isArray(response.data)) {
        // Fallback: Client-side pagination and filtering
        let filtered = response.data;

        // Client-side filtering if backend didn't do it (double check)
        if (search) {
          const lowerSearch = search.toLowerCase();
          filtered = filtered.filter(
            (item: any) =>
              item.name?.toLowerCase().includes(lowerSearch) ||
              item.type?.toLowerCase().includes(lowerSearch) ||
              item.village?.name?.toLowerCase().includes(lowerSearch)
          );
        }
        if (region) {
          filtered = filtered.filter(
            (item: any) => item.village?.district?.region?.name === region
          );
        }
        if (status) {
          filtered = filtered.filter(
            (item: any) => item.status?.toLowerCase() === status.toLowerCase()
          );
        }

        const total = filtered.length;
        const startIndex = (page - 1) * 10;
        const paginatedData = filtered.slice(startIndex, startIndex + 10);

        setData(paginatedData);
        setMeta({
          total,
          page,
          limit: 10,
          totalPages: Math.ceil(total / 10),
        });
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      setError("Failed to load data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, region, district, status]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      fetchData(newPage);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this water source?")) return;

    try {
      await api.delete(`/water-sources/${id}`);
      fetchData(meta.page); // Refresh current page
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete water source");
    }
  };

  const handleExport = () => {
    // Simple CSV export implementation
    const headers = [
      "ID",
      "Name",
      "Type",
      "Status",
      "Region",
      "District",
      "Village",
      "Last Maintained",
    ];
    const csvContent = [
      headers.join(","),
      ...data.map((item) =>
        [
          item.id,
          `"${item.name}"`,
          item.type,
          item.status,
          item.village?.district?.region?.name || "",
          item.village?.district?.name || "",
          item.village?.name || "",
          item.last_maintained || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `water-sources-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "functional":
      case "working":
        return "bg-green-100 text-green-700 border-green-200";
      case "needs repair":
      case "maintenance":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "non-functional":
      case "broken":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "functional":
      case "working":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "needs repair":
      case "maintenance":
        return <Wrench className="w-5 h-5 text-orange-500" />;
      case "non-functional":
      case "broken":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleViewDetails = (waterSource: WaterSource) => {
    setSelectedWaterSource(waterSource);
    setShowDetailsModal(true);
    setOpenActionId(null); // Close action menu
  };

  const getWaterLevelColor = (level: number) => {
    if (level >= 80) return "text-green-600";
    if (level >= 50) return "text-orange-500";
    return "text-red-600";
  };

  const getWaterLevelText = (level: number) => {
    if (level >= 80) return "Optimal";
    if (level >= 50) return "Moderate";
    if (level >= 20) return "Low";
    return "Critical";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              National Water Database
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and monitor water resources across all regions
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchData(meta.page)}
              className="p-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-gray-200 hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 flex-wrap items-center justify-between">
          <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sources, villages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full overflow-x-auto pb-2 sm:pb-0">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg flex-shrink-0">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">
                Filters:
              </span>
            </div>

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:border-gray-300 transition-colors min-w-0 flex-1 sm:flex-none"
            >
              <option value="">All Regions</option>
              <option value="Awdal">Awdal</option>
              <option value="Woqooyi Galbeed">Woqooyi Galbeed</option>
              <option value="Togdheer">Togdheer</option>
              {/* Add dynamic regions if needed */}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:border-gray-300 transition-colors min-w-0 flex-1 sm:flex-none"
            >
              <option value="">All Status</option>
              <option value="Working">Working</option>
              <option value="Needs Maintenance">Needs Maintenance</option>
              <option value="Broken">Broken</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchData(1)}
              className="text-sm font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Data Table - Desktop */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Source ID
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Installation Name
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  // Skeleton Loading Rows
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-100 rounded w-12"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-100 rounded w-32"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-100 rounded w-20"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-6 bg-gray-100 rounded w-20"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                      </td>
                      <td className="py-4 px-6"></td>
                    </tr>
                  ))
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          No water sources found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-blue-50/30 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-medium text-gray-500">
                          #{item.id}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Droplet className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 md:hidden">
                              {item.village?.name},{" "}
                              {item.village?.district?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {item.village?.district?.region?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.village?.district?.name} •{" "}
                            {item.village?.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              item.status === "Working"
                                ? "bg-green-500"
                                : item.status === "Needs Maintenance"
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500">
                          {item.last_maintained
                            ? new Date(
                                item.last_maintained
                              ).toLocaleDateString()
                            : "Never"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionId(
                              openActionId === item.id ? null : item.id
                            );
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {/* Actions Dropdown */}
                        {openActionId === item.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5">
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
                            >
                              <span>View Details</span>
                            </button>
                            <div className="h-px bg-gray-50"></div>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                            >
                              <span>Delete Source</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            // Skeleton Loading Cards
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-100 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-100 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-16"></div>
                  <div className="h-3 bg-gray-100 rounded w-28"></div>
                  <div className="h-3 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : data.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-gray-50 rounded-full mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900">
                  No water sources found
                </p>
                <p className="text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        #{item.id} • {item.type}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(
                      item.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        item.status === "Working"
                          ? "bg-green-500"
                          : item.status === "Needs Maintenance"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {item.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-900 text-right">
                      {item.village?.district?.region?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">District:</span>
                    <span className="text-gray-900 text-right">
                      {item.village?.district?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Village:</span>
                    <span className="text-gray-900 text-right">
                      {item.village?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Update:</span>
                    <span className="text-gray-900 text-right">
                      {item.last_maintained
                        ? new Date(item.last_maintained).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className="px-4 md:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-medium text-gray-900">{meta.total}</span>{" "}
            results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 px-2 whitespace-nowrap">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Water Source Details Modal */}
      {showDetailsModal && selectedWaterSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div 
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedWaterSource.name}
                  </h2>
                  <p className="text-gray-500">
                    Source ID: #{selectedWaterSource.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Status Section */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      STATUS
                    </h3>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(selectedWaterSource.status)}
                      <div className="flex-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedWaterSource.status)}`}>
                          {selectedWaterSource.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedWaterSource.status === "Working" 
                            ? "This water source is fully operational"
                            : selectedWaterSource.status === "Needs Maintenance"
                            ? "Maintenance required soon"
                            : "Out of service - needs repair"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Water Level Section */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      WATER LEVEL
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {selectedWaterSource.water_level}%
                        </span>
                        <span className={`font-medium ${getWaterLevelColor(selectedWaterSource.water_level)}`}>
                          {getWaterLevelText(selectedWaterSource.water_level)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getWaterLevelColor(selectedWaterSource.water_level).replace('text-', 'bg-')}`}
                          style={{ width: `${selectedWaterSource.water_level}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Type Information */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      SOURCE TYPE
                    </h3>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedWaterSource.type}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Water collection and distribution system
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Location Details */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      LOCATION DETAILS
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Region</span>
                        <span className="font-medium text-gray-900">
                          {selectedWaterSource.village?.district?.region?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">District</span>
                        <span className="font-medium text-gray-900">
                          {selectedWaterSource.village?.district?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Village</span>
                        <span className="font-medium text-gray-900">
                          {selectedWaterSource.village?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Information */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      MAINTENANCE HISTORY
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Last Maintained</span>
                        <span className="font-medium text-gray-900">
                          {selectedWaterSource.last_maintained
                            ? new Date(selectedWaterSource.last_maintained).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "Never"}
                        </span>
                      </div>
                      {selectedWaterSource.last_maintained && (
                        <div className="text-sm text-gray-500">
                          Last maintenance was {Math.floor((new Date().getTime() - new Date(selectedWaterSource.last_maintained).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      QUICK ACTIONS
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          alert(`Marking ${selectedWaterSource.name} for maintenance`);
                          setShowDetailsModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-medium transition-colors"
                      >
                        Schedule Maintenance
                      </button>
                      <button
                        onClick={() => {
                          alert(`Generating report for ${selectedWaterSource.name}`);
                          setShowDetailsModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedWaterSource.id);
                  setShowDetailsModal(false);
                }}
                className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Delete Source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}