"use client";

import Footer from "@/components/footer";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ogaal Documentation</h1>
            <p className="text-gray-600">Comprehensive guide to using the Ogaal Water Source Reporting & Monitoring Platform</p>
          </div>

          <div className="space-y-8">
            {/* Getting Started */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
              <p className="text-gray-700 mb-4">
                Ogaal is a centralized platform for reporting and monitoring water sources in Somaliland.
                Access to clean and functional water sources is critical for community health and development.
              </p>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Report water source conditions in real-time</li>
                <li>Monitor system performance through analytics dashboard</li>
                <li>Access geographic distribution of water sources</li>
                <li>Administrative tools for source management</li>
              </ul>
            </section>

            {/* User Guide */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Guide</h2>

              <h3 className="text-lg font-medium text-gray-900 mb-2">Reporting Issues</h3>
              <p className="text-gray-700 mb-4">
                To report a water source issue:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-1 mb-4">
                <li>Navigate to the Report page</li>
                <li>Select your village/location</li>
                <li>Choose the specific water source</li>
                <li>Select the current status (Working, Low Water, Broken, Other)</li>
                <li>Provide additional details in the description</li>
                <li>Submit the report</li>
              </ol>

              <h3 className="text-lg font-medium text-gray-900 mb-2">Viewing Analytics</h3>
              <p className="text-gray-700 mb-4">
                The Analytics Dashboard provides:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Overview of total water sources and functionality rates</li>
                <li>Geographic distribution on an interactive map</li>
                <li>Source type analysis (Boreholes, Dug Wells, Berkads, Dams)</li>
                <li>Performance trends over time</li>
                <li>Regional performance comparisons</li>
              </ul>
            </section>

            {/* API Reference */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Reference</h2>
              <p className="text-gray-700 mb-4">
                Ogaal provides RESTful APIs for integration with external systems.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-2">Endpoints</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm font-mono text-blue-600">GET /api/water-sources</code>
                  <p className="text-sm text-gray-600 mt-1">Retrieve all water sources</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm font-mono text-blue-600">POST /api/reports</code>
                  <p className="text-sm text-gray-600 mt-1">Submit a new water source report</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm font-mono text-blue-600">GET /api/villages</code>
                  <p className="text-sm text-gray-600 mt-1">Get list of villages/regions</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm font-mono text-blue-600">GET /api/stats</code>
                  <p className="text-sm text-gray-600 mt-1">Retrieve dashboard statistics</p>
                </div>
              </div>
            </section>

            {/* Support */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Support & Contact</h2>
              <p className="text-gray-700 mb-4">
                For technical support or questions about using the platform:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li><strong>Email:</strong> contact@ogaal.org</li>
                <li><strong>Location:</strong> Somaliland</li>
                <li><strong>Documentation:</strong> This page provides comprehensive guidance</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}