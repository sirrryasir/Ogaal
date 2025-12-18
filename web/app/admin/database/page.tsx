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

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              National Water Database
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and monitor water resources across all regions
            </p>
          </div>
          <div className="flex gap-3">
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
              className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-gray-200 hover:shadow-xl"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
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

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg min-w-fit">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">
                Filters:
              </span>
            </div>

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:border-gray-300 transition-colors"
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
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:border-gray-300 transition-colors"
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

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
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
                              onClick={() =>
                                alert("Details view to be implemented")
                              }
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

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
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
              <span className="text-sm font-medium text-gray-700 px-2">
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
      </div>
    </div>
  );
}
