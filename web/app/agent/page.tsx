"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wifi, WifiOff, UploadCloud, CheckCircle } from "lucide-react";

export default function AgentPage() {
  const [offlineMode, setOfflineMode] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    boreholeId: "",
    villageId: "",
    status: "Working",
    content: "",
  });
  const [syncing, setSyncing] = useState(false);

  const handleSave = () => {
    if (!formData.boreholeId || !formData.content) return;

    const newReport = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      synced: false,
    };

    setReports([newReport, ...reports]);
    setFormData({
      boreholeId: "",
      villageId: "",
      status: "Working",
      content: "",
    });
  };

  const handleSync = async () => {
    if (offlineMode) return;
    setSyncing(true);

    // Simulate sync
    for (const report of reports) {
      if (!report.synced) {
        try {
          await fetch("http://localhost:3001/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              borehole_id: report.boreholeId,
              village_id: report.villageId || 1, // Default for demo
              reporter_type: "Agent",
              report_content: `${report.status}: ${report.content}`,
            }),
          });
          report.synced = true;
        } catch (e) {
          console.error("Sync failed", e);
        }
      }
    }

    setReports(reports.map((r) => ({ ...r, synced: true })));
    setSyncing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Mobile Header */}
      <div
        className={`p-4 text-white flex justify-between items-center shadow ${
          offlineMode ? "bg-gray-800" : "bg-green-600"
        }`}
      >
        <h1 className="font-bold text-lg">💧 AquaGuard Agent</h1>
        <div
          onClick={() => setOfflineMode(!offlineMode)}
          className="flex items-center space-x-2 text-sm cursor-pointer bg-white/20 px-2 py-1 rounded"
        >
          {offlineMode ? (
            <>
              <WifiOff size={16} /> <span>Offline</span>
            </>
          ) : (
            <>
              <Wifi size={16} /> <span>Online</span>
            </>
          )}
        </div>
      </div>

      <main className="p-4 flex-grow space-y-6">
        {/* Submit Report Form */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3">New Field Report</h2>
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Borehole ID (e.g., 1)"
              className="w-full p-3 bg-gray-50 rounded border"
              value={formData.boreholeId}
              onChange={(e) =>
                setFormData({ ...formData, boreholeId: e.target.value })
              }
            />
            <select
              className="w-full p-3 bg-gray-50 rounded border"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option>Working</option>
              <option>Broken</option>
              <option>Low Water</option>
            </select>
            <textarea
              placeholder="Observations (e.g., Pump handle loose)"
              className="w-full p-3 bg-gray-50 rounded border h-24"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow active:scale-95 transition"
            >
              Save Report (Offline)
            </button>
          </div>
        </div>

        {/* Pending Reports */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-gray-700">
              Stored Reports ({reports.filter((r) => !r.synced).length})
            </h2>
            <button
              onClick={handleSync}
              disabled={offlineMode || reports.every((r) => r.synced)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-bold transition ${
                offlineMode
                  ? "bg-gray-300 text-gray-500"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {syncing ? (
                "Syncing..."
              ) : (
                <>
                  <UploadCloud size={16} /> <span>Sync Now</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            {reports.length === 0 && (
              <p className="text-gray-400 text-center text-sm py-4">
                No reports stored.
              </p>
            )}
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center border-l-4 border-l-blue-500"
              >
                <div>
                  <p className="font-bold text-gray-800">
                    BH-{report.boreholeId} • {report.status}
                  </p>
                  <p className="text-xs text-gray-500">{report.content}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(report.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  {report.synced ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <div className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Pending
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="p-4 text-center">
        <Link href="/" className="text-sm text-blue-500 underline">
          Back to Portal
        </Link>
      </div>
    </div>
  );
}
