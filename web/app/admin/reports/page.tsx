import { AlertTriangle, Check, X } from "lucide-react";
import { approveReport, rejectReport } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// Mock data if DB fails
const mockReports = [
  {
    id: 101,
    source: { name: "Central Borehole" },
    status: "broken",
    note: "Pump is making noise",
    created_at: new Date(),
    submitted_by: "Ahmed",
    approved: false,
  },
  {
    id: 102,
    source: { name: "Village Well 1" },
    status: "low",
    note: "Water level dropping fast",
    created_at: new Date(),
    submitted_by: "Fadumo",
    approved: false,
  },
];

async function getReports() {
  try {
    const reports = await prisma.report.findMany({
      include: { borehole: true },
      orderBy: { timestamp: "desc" },
    });

    return reports.map((r) => ({
      id: r.id,
      source: { name: r.borehole?.name || "Unknown Source" },
      status: r.report_content?.includes("Broad")
        ? "broken"
        : r.report_content?.toLowerCase() || "unknown", // Simple logic
      note: r.report_content,
      created_at: r.timestamp || new Date(),
      submitted_by: r.reporter_type || "Unknown",
      approved: r.is_verified === 1,
    }));
  } catch (e) {
    return mockReports;
  }
}

export default async function AdminReportsPage() {
  const reports = await getReports();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Report Approvals
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Source</th>
              <th className="p-4">Issue</th>
              <th className="p-4">Note</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report: any) => (
              <tr
                key={report.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 font-medium text-gray-900">
                  {/* @ts-ignore - mock data vs real data type diff handled loosely for demo */}
                  {report.source?.name || "Unknown"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      report.status === "broken" || report.status === "no_water"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm max-w-xs truncate">
                  {report.note || "-"}
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {/* @ts-ignore */}
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <form
                      action={async () => {
                        "use server";
                        await approveReport(report.id);
                      }}
                    >
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await rejectReport(report.id);
                      }}
                    >
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  No pending reports
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
