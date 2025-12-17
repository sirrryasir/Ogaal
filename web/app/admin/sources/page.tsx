"use client";

import { useState, useEffect } from "react";
import { 
  ChevronRight, 
  MapPin, 
  Droplet, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Users,
  TrendingUp,
  AlertCircle,
  Search,
  Download,
  BarChart3,
  Map,
  Table
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock hierarchical data
const HIERARCHICAL_DATA = [
  {
    region: "Maroodi Jeex",
    totalSources: 420,
    avgStatus: 78,
    districts: [
      {
        name: "Hargeisa",
        totalSources: 420,
        avgStatus: 78,
        villages: [
          { name: "Jigjiga Yar", totalSources: 120, avgStatus: 82, functional: 98, needsRepair: 15, nonFunctional: 7 },
          { name: "Mohamed Mooge", totalSources: 90, avgStatus: 74, functional: 67, needsRepair: 16, nonFunctional: 7 },
          { name: "26 June", totalSources: 210, avgStatus: 77, functional: 162, needsRepair: 32, nonFunctional: 16 },
        ]
      },
      {
        name: "Gabiley",
        totalSources: 285,
        avgStatus: 82,
        villages: [
          { name: "Allaybaday", totalSources: 95, avgStatus: 85, functional: 81, needsRepair: 10, nonFunctional: 4 },
          { name: "Wajaale", totalSources: 120, avgStatus: 81, functional: 97, needsRepair: 18, nonFunctional: 5 },
          { name: "Kalabaydh", totalSources: 70, avgStatus: 80, functional: 56, needsRepair: 10, nonFunctional: 4 },
        ]
      }
    ]
  },
  {
    region: "Togdheer",
    totalSources: 315,
    avgStatus: 72,
    districts: [
      {
        name: "Burao",
        totalSources: 220,
        avgStatus: 70,
        villages: [
          { name: "Burao Central", totalSources: 85, avgStatus: 75, functional: 64, needsRepair: 15, nonFunctional: 6 },
          { name: "Sheikh Omar", totalSources: 70, avgStatus: 68, functional: 48, needsRepair: 16, nonFunctional: 6 },
          { name: "Idhanka", totalSources: 65, avgStatus: 67, functional: 44, needsRepair: 15, nonFunctional: 6 },
        ]
      },
      {
        name: "Oodweyne",
        totalSources: 95,
        avgStatus: 76,
        villages: [
          { name: "Oodweyne Town", totalSources: 55, avgStatus: 78, functional: 43, needsRepair: 9, nonFunctional: 3 },
          { name: "Qori Lugud", totalSources: 40, avgStatus: 73, functional: 29, needsRepair: 8, nonFunctional: 3 },
        ]
      }
    ]
  },
  {
    region: "Woqooyi Galbeed",
    totalSources: 275,
    avgStatus: 81,
    districts: [
      {
        name: "Berbera",
        totalSources: 180,
        avgStatus: 83,
        villages: [
          { name: "Berbera Port", totalSources: 75, avgStatus: 85, functional: 64, needsRepair: 8, nonFunctional: 3 },
          { name: "Sheikh", totalSources: 105, avgStatus: 82, functional: 86, needsRepair: 14, nonFunctional: 5 },
        ]
      },
      {
        name: "Sheikh",
        totalSources: 95,
        avgStatus: 78,
        villages: [
          { name: "Sheikh Town", totalSources: 65, avgStatus: 80, functional: 52, needsRepair: 10, nonFunctional: 3 },
          { name: "Ceel Afweyn", totalSources: 30, avgStatus: 73, functional: 22, needsRepair: 6, nonFunctional: 2 },
        ]
      }
    ]
  }
];

// Status colors
const STATUS_COLORS = {
  functional: "#22c55e",
  needsRepair: "#f97316",
  nonFunctional: "#ef4444"
};

export default function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'cards' | 'charts' | 'map'>('cards');
  const [searchQuery, setSearchQuery] = useState('');

  // Get current view data based on selection
  const currentRegion = selectedRegion ? HIERARCHICAL_DATA.find(r => r.region === selectedRegion) : null;
  const currentDistrict = selectedDistrict ? currentRegion?.districts.find(d => d.name === selectedDistrict) : null;

  // Prepare chart data
  const regionChartData = HIERARCHICAL_DATA.map(region => ({
    name: region.region,
    sources: region.totalSources,
    status: region.avgStatus
  }));

  const statusChartData = [
    { name: "Functional", value: 785, color: STATUS_COLORS.functional },
    { name: "Needs Repair", value: 156, color: STATUS_COLORS.needsRepair },
    { name: "Non-Functional", value: 62, color: STATUS_COLORS.nonFunctional },
  ];

  const toggleRegion = (regionName: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionName)) {
      newExpanded.delete(regionName);
      setSelectedRegion(null);
      setSelectedDistrict(null);
    } else {
      newExpanded.add(regionName);
    }
    setExpandedRegions(newExpanded);
  };

  const toggleDistrict = (districtName: string) => {
    const newExpanded = new Set(expandedDistricts);
    if (newExpanded.has(districtName)) {
      newExpanded.delete(districtName);
    } else {
      newExpanded.add(districtName);
    }
    setExpandedDistricts(newExpanded);
  };

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName);
    setSelectedDistrict(null);
  };

  const handleDistrictSelect = (districtName: string) => {
    setSelectedDistrict(districtName);
  };

  const handleBackToRegions = () => {
    setSelectedRegion(null);
    setSelectedDistrict(null);
  };

  const handleBackToDistricts = () => {
    setSelectedDistrict(null);
  };

  // Filter data based on search
  const filteredData = HIERARCHICAL_DATA.filter(region => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      region.region.toLowerCase().includes(searchLower) ||
      region.districts.some(d => 
        d.name.toLowerCase().includes(searchLower) ||
        d.villages.some(v => v.name.toLowerCase().includes(searchLower))
      )
    );
  });

  // Calculate overall stats
  const overallStats = {
    totalSources: HIERARCHICAL_DATA.reduce((sum, region) => sum + region.totalSources, 0),
    avgStatus: Math.round(HIERARCHICAL_DATA.reduce((sum, region) => sum + region.avgStatus, 0) / HIERARCHICAL_DATA.length),
    totalVillages: HIERARCHICAL_DATA.reduce((sum, region) => 
      sum + region.districts.reduce((dSum, district) => dSum + district.villages.length, 0), 0
    ),
    totalDistricts: HIERARCHICAL_DATA.reduce((sum, region) => sum + region.districts.length, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Water Sources Dashboard</h1>
              <p className="text-gray-600">Hierarchical view of water sources by region, district, and village</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search region, district, or village..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Table className="w-4 h-4" />
              Cards View
            </button>
            <button
              onClick={() => setViewMode('charts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'charts' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Charts View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'map' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Map className="w-4 h-4" />
              Map View
            </button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sources</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalSources.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Droplet className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Across {overallStats.totalDistricts} districts</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Status</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.avgStatus}%</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">System functionality rate</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Villages Covered</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalVillages}</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">In {HIERARCHICAL_DATA.length} regions</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                  <p className="text-2xl font-bold text-gray-900">42</p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Sources needing repair</div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {(selectedRegion || selectedDistrict) && (
          <div className="flex items-center gap-2 mb-6 text-sm">
            <button 
              onClick={handleBackToRegions}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              All Regions
            </button>
            {selectedRegion && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button 
                  onClick={selectedDistrict ? handleBackToDistricts : undefined}
                  className={`${selectedDistrict ? 'text-blue-600 hover:text-blue-800 hover:underline' : 'text-gray-900'}`}
                >
                  {selectedRegion}
                </button>
              </>
            )}
            {selectedDistrict && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{selectedDistrict}</span>
              </>
            )}
          </div>
        )}

        {/* Main Content */}
        {viewMode === 'charts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Region Comparison Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Region Comparison</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="sources" name="Total Sources" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar yAxisId="right" dataKey="status" name="Avg. Status %" fill="#22c55e" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <div className="h-96 rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map would appear here</p>
                <p className="text-sm text-gray-500 mt-2">Click on regions to drill down</p>
              </div>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="space-y-4">
            {/* Region/Selection Header */}
            {selectedRegion ? (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedRegion}</h2>
                    <p className="text-gray-600">
                      {selectedDistrict ? `District: ${selectedDistrict}` : `Total Districts: ${currentRegion?.districts.length}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedDistrict ? currentDistrict?.totalSources : currentRegion?.totalSources}
                    </div>
                    <div className="text-sm text-gray-600">Water Sources</div>
                  </div>
                </div>
                
                {/* Status Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {selectedDistrict 
                        ? currentDistrict?.villages.reduce((sum, v) => sum + v.functional, 0)
                        : currentRegion?.districts.reduce((sum, d) => 
                            sum + d.villages.reduce((vSum, v) => vSum + v.functional, 0), 0
                          )}
                    </div>
                    <div className="text-sm text-gray-600">Functional</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      {selectedDistrict 
                        ? currentDistrict?.villages.reduce((sum, v) => sum + v.needsRepair, 0)
                        : currentRegion?.districts.reduce((sum, d) => 
                            sum + d.villages.reduce((vSum, v) => vSum + v.needsRepair, 0), 0
                          )}
                    </div>
                    <div className="text-sm text-gray-600">Needs Repair</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {selectedDistrict 
                        ? currentDistrict?.villages.reduce((sum, v) => sum + v.nonFunctional, 0)
                        : currentRegion?.districts.reduce((sum, d) => 
                            sum + d.villages.reduce((vSum, v) => vSum + v.nonFunctional, 0), 0
                          )}
                    </div>
                    <div className="text-sm text-gray-600">Non-Functional</div>
                  </div>
                </div>
              </div>
            ) : (
              <h2 className="text-xl font-bold text-gray-900 mb-6">Regions ({filteredData.length})</h2>
            )}

            {/* Region/District/Village Cards */}
            <div className="space-y-4">
              {!selectedRegion ? (
                // Region View
                filteredData.map(region => (
                  <div key={region.region} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleRegionSelect(region.region)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <MapPin className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{region.region}</h3>
                            <p className="text-sm text-gray-600">
                              {region.districts.length} districts • {region.totalSources} sources
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{region.avgStatus}%</div>
                          <div className="text-sm text-gray-600">Avg. Status</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* District Preview */}
                    <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {region.districts.slice(0, 3).map(district => (
                        <div 
                          key={district.name}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => {
                            handleRegionSelect(region.region);
                            handleDistrictSelect(district.name);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{district.name}</h4>
                              <p className="text-sm text-gray-600">{district.totalSources} sources</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">{district.avgStatus}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : !selectedDistrict ? (
                // District View for Selected Region
                currentRegion?.districts.map(district => (
                  <div 
                    key={district.name}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:border-blue-300 transition-colors"
                    onClick={() => handleDistrictSelect(district.name)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <MapPin className="w-6 h-6 text-green-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{district.name}</h3>
                            <p className="text-sm text-gray-600">
                              {district.villages.length} villages • {district.totalSources} sources
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{district.avgStatus}%</div>
                          <div className="text-sm text-gray-600">Avg. Status</div>
                        </div>
                      </div>
                      
                      {/* Village Preview */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {district.villages.map(village => (
                          <div key={village.name} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{village.name}</h4>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">{village.avgStatus}%</div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Functional:</span>
                                <span className="font-medium text-green-600">{village.functional}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Needs Repair:</span>
                                <span className="font-medium text-orange-600">{village.needsRepair}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Non-Functional:</span>
                                <span className="font-medium text-red-600">{village.nonFunctional}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Village View for Selected District
                currentDistrict?.villages.map(village => (
                  <div key={village.name} className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{village.name}</h3>
                          <p className="text-gray-600">Village in {selectedDistrict}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">{village.avgStatus}%</div>
                          <div className="text-sm text-gray-600">Overall Status</div>
                        </div>
                      </div>
                      
                      {/* Detailed Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">Functional</span>
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-700 font-bold">{village.functional}</span>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-green-700">{village.functional}</div>
                          <div className="text-sm text-green-600">
                            {((village.functional / village.totalSources) * 100).toFixed(1)}% of total
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-orange-800">Needs Repair</span>
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-700 font-bold">{village.needsRepair}</span>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-orange-700">{village.needsRepair}</div>
                          <div className="text-sm text-orange-600">
                            {((village.needsRepair / village.totalSources) * 100).toFixed(1)}% of total
                          </div>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-red-800">Non-Functional</span>
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-700 font-bold">{village.nonFunctional}</span>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-red-700">{village.nonFunctional}</div>
                          <div className="text-sm text-red-600">
                            {((village.nonFunctional / village.totalSources) * 100).toFixed(1)}% of total
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-6 flex justify-end gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Schedule Maintenance
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}