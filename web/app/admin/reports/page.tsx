"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { AlertTriangle, Check, Search, Filter, Download, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { approveReport, rejectReport } from "@/lib/actions";
import api from "@/lib/api";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Report {
  id: number;
  source: {
    name: string;
  };
  status: string;
  note: string;
  created_at: Date;
  submitted_by: string;
  approved: boolean;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmVariant: "primary" as "primary" | "danger",
    action: null as (() => Promise<void>) | null,
    loading: false,
    success: false,
    error: false,
    successMessage: "",
    errorMessage: "",
  });

  const fetchReports = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
        status: statusFilter,
      });

      const res = await api.get(`/reports?${params}`);
      // Handle both paginated and array responses
      if (res.data.data) {
        setReports(res.data.data.map((r: any) => ({
          id: r.id,
          source: {
            name: r.water_source?.name || r.village?.name || "Unknown Source",
          },
          status: r.content?.includes("Broad")
            ? "broken"
            : r.content?.toLowerCase() || "unknown",
          note: r.content,
          created_at: r.timestamp || new Date(),
          submitted_by: r.reporter_type || "Unknown",
          approved: r.is_verified,
        })));
        setMeta(res.data.meta);
      } else if (Array.isArray(res.data)) {
        // Fallback: Client-side filtering and pagination
        let filtered = res.data.map((r: any) => ({
          id: r.id,
          source: {
            name: r.water_source?.name || r.village?.name || "Unknown Source",
          },
          status: r.content?.includes("Broad")
            ? "broken"
            : r.content?.toLowerCase() || "unknown",
          note: r.content,
          created_at: r.timestamp || new Date(),
          submitted_by: r.reporter_type || "Unknown",
          approved: r.is_verified,
        }));

        // Client-side filtering
        if (search) {
          const lowerSearch = search.toLowerCase();
          filtered = filtered.filter(
            (item: Report) =>
              item.source.name?.toLowerCase().includes(lowerSearch) ||
              item.note?.toLowerCase().includes(lowerSearch) ||
              item.submitted_by?.toLowerCase().includes(lowerSearch)
          );
        }
        if (statusFilter) {
          filtered = filtered.filter(
            (item: Report) => item.status?.toLowerCase() === statusFilter.toLowerCase()
          );
        }

        const total = filtered.length;
        const startIndex = (page - 1) * 10;
        const paginatedData = filtered.slice(startIndex, startIndex + 10);

        setReports(paginatedData);
        setMeta({
          total,
          page,
          limit: 10,
          totalPages: Math.ceil(total / 10),
        });
      }
    } catch (e) {
      console.warn("API Fetch failed:", e);
      setError("Failed to load reports. Please check your connection.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      fetchReports(newPage);
    }
  };

  const handleExport = () => {
    // Simple CSV export implementation
    const headers = [
      "ID",
      "Source",
      "Status",
      "Note",
      "Submitted By",
      "Date",
      "Approved",
    ];
    const csvContent = [
      headers.join(","),
      ...reports.map((item) =>
        [
          item.id,
          `"${item.source.name}"`,
          item.status,
          `"${item.note || ""}"`,
          item.submitted_by,
          item.created_at.toISOString(),
          item.approved ? "Yes" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const openApproveModal = (report: Report) => {
    setModalState({
      isOpen: true,
      title: "Approve Report",
      message: `Are you sure you want to approve the report for "${report.source.name}"? This action will mark the report as verified.`,
      confirmText: "Approve",
      cancelText: "Cancel",
      confirmVariant: "primary",
      action: async () => {
        setModalState(prev => ({ ...prev, loading: true }));
        try {
          await approveReport(report.id);
          setModalState(prev => ({
            ...prev,
            loading: false,
            success: true,
            successMessage: `Report for "${report.source.name}" has been approved successfully.`,
          }));
          fetchReports(meta.page);
        } catch (error) {
          setModalState(prev => ({
            ...prev,
            loading: false,
            error: true,
            errorMessage: "Failed to approve the report. Please try again.",
          }));
        }
      },
      loading: false,
      success: false,
      error: false,
      successMessage: "",
      errorMessage: "",
    });
  };

  const openRejectModal = (report: Report) => {
    setModalState({
      isOpen: true,
      title: "Reject Report",
      message: `Are you sure you want to reject the report for "${report.source.name}"? This action cannot be undone.`,
      confirmText: "Reject",
      cancelText: "Cancel",
      confirmVariant: "danger",
      action: async () => {
        setModalState(prev => ({ ...prev, loading: true }));
        try {
          await rejectReport(report.id);
          setModalState(prev => ({
            ...prev,
            loading: false,
            success: true,
            successMessage: `Report for "${report.source.name}" has been rejected.`,
          }));
          fetchReports(meta.page);
        } catch (error) {
          setModalState(prev => ({
            ...prev,
            loading: false,
            error: true,
            errorMessage: "Failed to reject the report. Please try again.",
          }));
        }
      },
      loading: false,
      success: false,
      error: false,
      successMessage: "",
      errorMessage: "",
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      cancelText: "Cancel",
      confirmVariant: "primary",
      action: null,
      loading: false,
      success: false,
      error: false,
      successMessage: "",
      errorMessage: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Report Approvals
            </h1>
            <p className="text-gray-500 mt-1">
              Review and manage water source reports across all regions
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchReports(meta.page)}
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
                placeholder="Search reports, sources..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:border-gray-300 transition-colors min-w-0 flex-1 sm:flex-none"
            >
              <option value="">All Status</option>
              <option value="working">Working</option>
              <option value="good">Good</option>
              <option value="low">Low</option>
              <option value="maintenance">Maintenance</option>
              <option value="dry">Dry</option>
              <option value="broken">Broken</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchReports(1)}
              className="text-sm font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
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
                        <div className="h-4 bg-gray-100 rounded w-32"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-6 bg-gray-100 rounded w-20"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-100 rounded w-16"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-100 rounded w-20"></div>
                      </td>
                      <td className="py-4 px-6"></td>
                    </tr>
                  ))
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          No reports found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr
                      key={report.id}
                      className="group hover:bg-blue-50/30 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">
                          {report.source.name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            report.status?.includes("working") ||
                            report.status?.includes("good")
                              ? "bg-green-100 text-green-700 border-green-200"
                              : report.status?.includes("low") ||
                                report.status?.includes("maintenance")
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : report.status?.includes("dry")
                              ? "bg-red-100 text-red-700 border-red-200"
                              : report.status?.includes("broken")
                              ? "bg-black text-white border-gray-300"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {report.status?.replace("_", " ") || "Unknown"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600 max-w-xs truncate block">
                          {report.note || "-"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {report.submitted_by}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openApproveModal(report)}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openRejectModal(report)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </div>
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
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : reports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-gray-50 rounded-full mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900">
                  No reports found
                </p>
                <p className="text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {report.source.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {report.submitted_by} • {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${
                      report.status?.includes("working") ||
                      report.status?.includes("good")
                        ? "bg-green-100 text-green-700 border-green-200"
                        : report.status?.includes("low") ||
                          report.status?.includes("maintenance")
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : report.status?.includes("dry")
                        ? "bg-red-100 text-red-700 border-red-200"
                        : report.status?.includes("broken")
                        ? "bg-black text-white border-gray-300"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {report.status?.replace("_", " ") || "Unknown"}
                  </span>
                </div>

                {report.note && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {report.note}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => openApproveModal(report)}
                    className="px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(report)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Reject
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        confirmVariant={modalState.confirmVariant}
        onConfirm={modalState.action || (() => {})}
        loading={modalState.loading}
        success={modalState.success}
        error={modalState.error}
        successMessage={modalState.successMessage}
        errorMessage={modalState.errorMessage}
      />
    </div>
  );
}

export default function AdminReportsPage() {
  return <ReportsPage />;
}
