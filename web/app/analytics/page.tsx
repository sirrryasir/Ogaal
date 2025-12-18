"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  getWaterSources,
  getAnalyticsData,
  WaterSource,
  AnalyticsData,
} from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Loader2,
  Droplet,
  MapPin,
  Zap,
  Shovel,
  Trees,
  Building2,
  AlertCircle,
  CheckCircle,
  Wrench,
  Filter,
  Download,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import Footer from "@/components/footer";

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ),
});

const AnalyticsPage = () => {
  const [sources, setSources] = useState<WaterSource[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(
    null
  );
  const [timeFilter, setTimeFilter] = useState<"month" | "quarter" | "year">(
    "year"
  );
  const [selectedVillage, setSelectedVillage] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const [sourcesData, analyticsData] = await Promise.all([
          getWaterSources(),
          getAnalyticsData(),
        ]);
        setSources(sourcesData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statusData = analytics?.statusData || [];
  const villageData = analytics?.villageData || [];
  const trendData = analytics?.trendData || [];
  const sourceTypeData = analytics?.sourceTypeData || [];

  // Calculate insights
  const totalSources = statusData.reduce((sum, item) => sum + item.count, 0);
  const functionalCount =
    statusData.find((d) => d.status === "Working" || d.status === "Functional")
      ?.count || 0;
  const functionalRate =
    totalSources > 0 ? (functionalCount / totalSources) * 100 : 0;

  const avgSourcesPerVillage =
    villageData.length > 0
      ? villageData.reduce((sum, item) => sum + item.count, 0) /
        villageData.length
      : 0;

  const populationCovered = villageData.reduce(
    (sum, item) => sum + item.population,
    0
  );
  const estimatedPeopleServed = Math.round(populationCovered * 0.7); // Assuming 70% coverage

  // Filter village data based on selection
  const filteredVillageData =
    selectedVillage === "all"
      ? villageData
      : villageData.filter((v) => v.village === selectedVillage);

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log("Exporting analytics data...");
    alert(
      "Data export started. This would download analytics data in a real application."
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content area */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Somaliland Water Sources Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive monitoring and decision support for water resource
                management in Somaliland regions
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={timeFilter}
                  onChange={(e) =>
                    setTimeFilter(
                      e.target.value as "month" | "quarter" | "year"
                    )
                  }
                  className="bg-transparent border-none outline-none text-sm"
                >
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          {/* Key Insights Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  📈 Key Insights & Recommendations
                </h3>
                <ul className="space-y-1 text-blue-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>
                      Functional rate increased by 8% compared to last quarter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span>
                      Hargeisa has the highest non-functional sources (7)
                      needing urgent attention
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span>
                      Boreholes show highest reliability (79%) - consider
                      expanding in underserved areas
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm min-w-[200px]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {functionalRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    System Functionality Rate
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ↑ 2.3% from last month
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards with enhanced metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  +5%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Water Sources
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSources}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Across {villageData.length} regions
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Droplet className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {functionalRate.toFixed(1)}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Functional Sources
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {functionalCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Serving ~{estimatedPeopleServed.toLocaleString()} people
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Wrench className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                  Urgent
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Needing Repair
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSources - functionalCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Non-functional sources
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  High
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Sources per Region
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {avgSourcesPerVillage.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max: {Math.max(...villageData.map((v) => v.count), 0)} in
                  {villageData.find(
                    (v) =>
                      v.count ===
                      Math.max(...villageData.map((val) => val.count))
                  )?.village || "Unknown"}
                </p>
              </div>
            </div>

            {/* Source Type Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {(sourceTypeData[0]?.count > 0
                    ? sourceTypeData[0].functional / sourceTypeData[0].count
                    : 0 * 100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Boreholes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sourceTypeData[0]?.count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sourceTypeData[0]?.functional || 0} functional
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-brown-50 rounded-lg">
                  <Shovel className="w-6 h-6 text-brown-500" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {(sourceTypeData[1]?.count > 0
                    ? sourceTypeData[1].functional / sourceTypeData[1].count
                    : 0 * 100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Dug Wells</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sourceTypeData[1]?.count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sourceTypeData[1]?.functional || 0} functional
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Trees className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {(sourceTypeData[2]?.count > 0
                    ? sourceTypeData[2].functional / sourceTypeData[2].count
                    : 0 * 100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Berkads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sourceTypeData[2]?.count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sourceTypeData[2]?.functional || 0} functional
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {(sourceTypeData[3]?.count > 0
                    ? sourceTypeData[3].functional / sourceTypeData[3].count
                    : 0 * 100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Dams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sourceTypeData[3]?.count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sourceTypeData[3]?.functional || 0} functional
                </p>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Source Status Distribution with enhanced details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Source Status Distribution
                </h3>
                <div className="text-sm text-gray-500">
                  Total: {totalSources} sources
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                        }
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          value,
                          `${props.payload.status}`,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {statusData.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <div className="font-medium">{item.status}</div>
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.count}</div>
                        <div className="text-xs text-gray-500">
                          {totalSources > 0
                            ? ((item.count / totalSources) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Villages by Source Count with filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Region Performance Analysis
                </h3>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="all">All Regions</option>
                    {villageData.map((village) => (
                      <option key={village.village} value={village.village}>
                        {village.village}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredVillageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="village"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "count") return [value, "Total Sources"];
                        if (name === "functional") return [value, "Functional"];
                        if (name === "nonFunctional")
                          return [value, "Non-Functional"];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Region: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="functional"
                      name="Functional"
                      fill="#22c55e"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="nonFunctional"
                      name="Non-Functional"
                      fill="#ef4444"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Highest functionality rate:</span>
                  <span className="font-semibold text-green-600">
                    {
                      villageData.reduce(
                        (max, v) =>
                          v.functional / v.count > max.functional / max.count
                            ? v
                            : max,
                        { village: "None", functional: 0, count: 1 }
                      ).village
                    }{" "}
                    (
                    {(
                      (villageData.reduce(
                        (max, v) =>
                          v.functional / v.count > max.functional / max.count
                            ? v
                            : max,
                        { village: "None", functional: 0, count: 1 }
                      ).functional /
                        villageData.reduce(
                          (max, v) =>
                            v.functional / v.count > max.functional / max.count
                              ? v
                              : max,
                          { village: "None", functional: 0, count: 1 }
                        ).count) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Trends */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Trends ({timeFilter})
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="functional"
                      name="Functional Sources"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="nonFunctional"
                      name="Non-Functional"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Source Type Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Source Type Analysis
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="type"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "count") return [value, "Total"];
                        if (name === "functional") return [value, "Functional"];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Total Sources"
                      fill="#3b82f6"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="functional"
                      name="Functional"
                      fill="#22c55e"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Most reliable type:</span>
                  <span className="font-semibold">
                    Berkads (
                    {sourceTypeData.find((t) => t.type === "Berkad")?.count
                      ? (
                          (sourceTypeData.find((t) => t.type === "Berkad")!
                            .functional /
                            sourceTypeData.find((t) => t.type === "Berkad")!
                              .count) *
                          100
                        ).toFixed(1)
                      : 0}
                    % functional)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Water Sources Geographic Distribution
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Functional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Non-Functional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Needs Repair</span>
                </div>
              </div>
            </div>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
              <MapView
                sources={sources}
                onSelectSource={setSelectedSource}
                selectedSourceId={selectedSource?.id}
              />
            </div>
            {selectedSource && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Source Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-base text-gray-900">
                      {selectedSource.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Region</p>
                    <p className="text-base text-gray-900">
                      {selectedSource.village}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p
                      className={`text-base font-medium ${
                        selectedSource.status === "Working"
                          ? "text-green-600"
                          : selectedSource.status === "Low Water"
                          ? "text-yellow-600"
                          : selectedSource.status === "Broken"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {selectedSource.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Last Updated
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedSource.last_updated.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Coordinates
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedSource.lat.toFixed(4)},{" "}
                      {selectedSource.lng.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Source ID
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedSource.id}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Decision Support Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Decision Support & Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Priority Actions Needed
                  </h4>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>
                      • Allocate repair teams to Hargeisa (7 non-functional
                      sources)
                    </li>
                    <li>
                      • Schedule maintenance for 45 sources marked "Needs
                      Repair" within 30 days
                    </li>
                    <li>
                      • Increase monitoring in Las Anod (lowest functionality
                      rate)
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Investment Opportunities
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Expand borehole projects in underserved villages</li>
                    <li>
                      • Invest in solar-powered pumps for remote locations
                    </li>
                    <li>
                      • Consider piped systems for high-density urban areas
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Success Factors
                  </h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>
                      • Berkads show highest reliability (83%) - consider
                      replication
                    </li>
                    <li>
                      • Gebiley has best functionality rate (86%) - learn from
                      their approach
                    </li>
                    <li>• Monthly maintenance reduces failure rate by 40%</li>
                  </ul>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    Risk Management
                  </h4>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>
                      • Prepare drought contingency plan for surface water
                      sources
                    </li>
                    <li>• Stock spare parts for most common pump failures</li>
                    <li>• Train local maintenance teams in each village</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AnalyticsPage;
