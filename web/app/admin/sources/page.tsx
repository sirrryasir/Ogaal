"use client";

import { useState, useEffect } from "react";
import { 
  ChevronRight, 
  ChevronDown,
  MapPin, 
  Droplet, 
  Search,
  Download,
  BarChart3,
  Map,
  Table,
  Filter,
  TrendingUp,
  AlertCircle,
  Users,
  Wrench,
  CheckCircle,
  XCircle,
  Zap,
  Shovel,
  Building2,
  Trees,
  Filter as FilterIcon
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock hierarchical data for all Somaliland regions
const SOMALILAND_REGIONS = [
  {
    region: "Maroodi-Jeex",
    totalSources: 420,
    avgStatus: 78,
    districts: [
      {
        name: "Hargeisa",
        totalSources: 250,
        avgStatus: 82,
        villages: [
          { 
            name: "Jigjiga Yar", 
            totalSources: 120, 
            avgStatus: 85,
            functional: 98, 
            needsRepair: 15, 
            nonFunctional: 7,
            sources: [
              { id: 1, source_name: "Jigjiga Yar Borehole 1", water_source_type: "Borehole", status: "functional", lat: 9.5621, lng: 44.0650 },
              { id: 2, source_name: "Jigjiga Yar Well 1", water_source_type: "Dug Well", status: "needs_repair", lat: 9.5623, lng: 44.0652 },
              { id: 3, source_name: "Jigjiga Yar Berkad", water_source_type: "Berkad", status: "functional", lat: 9.5625, lng: 44.0654 }
            ]
          },
          { 
            name: "Mohamed Mooge", 
            totalSources: 90, 
            avgStatus: 74,
            functional: 67, 
            needsRepair: 16, 
            nonFunctional: 7,
            sources: [
              { id: 4, source_name: "Mooge Primary School Well", water_source_type: "Dug Well", status: "functional", lat: 9.5681, lng: 44.0670 },
              { id: 5, source_name: "Mooge Community Borehole", water_source_type: "Borehole", status: "alaw_water", lat: 9.5683, lng: 44.0672 }
            ]
          },
          { 
            name: "26 June", 
            totalSources: 210, 
            avgStatus: 77,
            functional: 162, 
            needsRepair: 32, 
            nonFunctional: 16,
            sources: [
              { id: 6, source_name: "26 June Dam", water_source_type: "Dam", status: "functional", lat: 9.5701, lng: 44.0690 },
              { id: 7, source_name: "June Hand Pump", water_source_type: "Hand Pump", status: "contaminated", lat: 9.5703, lng: 44.0692 }
            ]
          }
        ]
      },
      {
        name: "Gabiley",
        totalSources: 170,
        avgStatus: 79,
        villages: [
          { 
            name: "Allaybaday", 
            totalSources: 95, 
            avgStatus: 85,
            functional: 81, 
            needsRepair: 10, 
            nonFunctional: 4,
            sources: [
              { id: 8, source_name: "Allaybaday Spring", water_source_type: "Spring", status: "functional", lat: 9.7000, lng: 43.8500 }
            ]
          }
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
          { 
            name: "Burao Central", 
            totalSources: 85, 
            avgStatus: 75,
            functional: 64, 
            needsRepair: 15, 
            nonFunctional: 6,
            sources: [
              { id: 9, source_name: "Burao Main Borehole", water_source_type: "Borehole", status: "functional", lat: 9.5200, lng: 45.5300 }
            ]
          }
        ]
      }
    ]
  },
  {
    region: "Gabiley",
    totalSources: 280,
    avgStatus: 85,
    districts: [
      {
        name: "Gabiley",
        totalSources: 280,
        avgStatus: 85,
        villages: [
          { 
            name: "Gabiley Town", 
            totalSources: 150, 
            avgStatus: 88,
            functional: 132, 
            needsRepair: 12, 
            nonFunctional: 6,
            sources: [
              { id: 10, source_name: "Gabiley Main Well", water_source_type: "Dug Well", status: "functional", lat: 9.7100, lng: 43.6200 }
            ]
          }
        ]
      }
    ]
  },
  {
    region: "Awdal",
    totalSources: 195,
    avgStatus: 68,
    districts: [
      {
        name: "Borama",
        totalSources: 195,
        avgStatus: 68,
        villages: [
          { 
            name: "Borama City", 
            totalSources: 120, 
            avgStatus: 65,
            functional: 78, 
            needsRepair: 30, 
            nonFunctional: 12,
            sources: [
              { id: 11, source_name: "Borama Hospital Borehole", water_source_type: "Borehole", status: "alaw_water", lat: 9.9400, lng: 43.1800 }
            ]
          }
        ]
      }
    ]
  },
  {
    region: "Saaxil",
    totalSources: 145,
    avgStatus: 82,
    districts: [
      {
        name: "Berbera",
        totalSources: 145,
        avgStatus: 82,
        villages: [
          { 
            name: "Berbera Port", 
            totalSources: 75, 
            avgStatus: 85,
            functional: 64, 
            needsRepair: 8, 
            nonFunctional: 3,
            sources: [
              { id: 12, source_name: "Port Desalination Plant", water_source_type: "Desalination", status: "functional", lat: 10.4300, lng: 45.0100 }
            ]
          }
        ]
      }
    ]
  },
  {
    region: "Sanaag",
    totalSources: 125,
    avgStatus: 62,
    districts: [
      {
        name: "Erigavo",
        totalSources: 125,
        avgStatus: 62,
        villages: [
          { 
            name: "Erigavo Town", 
            totalSources: 80, 
            avgStatus: 60,
            functional: 48, 
            needsRepair: 20, 
            nonFunctional: 12,
            sources: [
              { id: 13, source_name: "Erigavo Mountain Spring", water_source_type: "Spring", status: "contaminated", lat: 10.6200, lng: 47.3700 }
            ]
          }
        ]
      }
    ]
  },
  {
    region: "Sool",
    totalSources: 110,
    avgStatus: 58,
    districts: [
      {
        name: "Las Anod",
        totalSources: 110,
        avgStatus: 58,
        villages: [
          { 
            name: "Las Anod City", 
            totalSources: 70, 
            avgStatus: 55,
            functional: 38, 
            needsRepair: 25, 
            nonFunctional: 7,
            sources: [
              { id: 14, source_name: "Las Anod Community Well", water_source_type: "Dug Well", status: "needs_repair", lat: 8.4800, lng: 47.3600 }
            ]
          }
        ]
      }
    ]
  }
];

// Water source types with icons
const WATER_SOURCE_TYPES = {
  "Borehole": { icon: Zap, color: "text-yellow-500", bgColor: "bg-yellow-50" },
  "Dug Well": { icon: Shovel, color: "text-brown-500", bgColor: "bg-brown-50" },
  "Berkad": { icon: Trees, color: "text-green-500", bgColor: "bg-green-50" },
  "Dam": { icon: Building2, color: "text-gray-500", bgColor: "bg-gray-50" },
  "Hand Pump": { icon: Droplet, color: "text-blue-500", bgColor: "bg-blue-50" },
  "Spring": { icon: Droplet, color: "text-cyan-500", bgColor: "bg-cyan-50" },
  "Desalination": { icon: Droplet, color: "text-purple-500", bgColor: "bg-purple-50" },
  "Piped System": { icon: Droplet, color: "text-indigo-500", bgColor: "bg-indigo-50" }
};

// Status configuration
const STATUS_CONFIG = {
  "functional": { 
    label: "Functional", 
    color: "text-green-700", 
    bgColor: "bg-green-100",
    icon: CheckCircle 
  },
  "needs_repair": { 
    label: "Needs Repair", 
    color: "text-orange-700", 
    bgColor: "bg-orange-100",
    icon: Wrench 
  },
  "non_functional": { 
    label: "Non-Functional", 
    color: "text-red-700", 
    bgColor: "bg-red-100",
    icon: XCircle 
  },
  "alaw_water": { 
    label: "Alaw Water", 
    color: "text-blue-700", 
    bgColor: "bg-blue-100",
    icon: AlertCircle 
  },
  "contaminated": { 
    label: "Contaminated", 
    color: "text-purple-700", 
    bgColor: "bg-purple-100",
    icon: AlertCircle 
  }
};

export default function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());
  const [expandedVillages, setExpandedVillages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'cards' | 'charts' | 'map'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Get current view data
  const currentRegion = selectedRegion ? SOMALILAND_REGIONS.find(r => r.region === selectedRegion) : null;
  const currentDistrict = selectedDistrict ? currentRegion?.districts.find(d => d.name === selectedDistrict) : null;
  const currentVillage = selectedVillage ? currentDistrict?.villages.find(v => v.name === selectedVillage) : null;

  // Prepare chart data
  const regionChartData = SOMALILAND_REGIONS.map(region => ({
    name: region.region,
    sources: region.totalSources,
    status: region.avgStatus
  }));

  // Calculate status distribution
  const statusDistribution = SOMALILAND_REGIONS.reduce((acc, region) => {
    region.districts.forEach(district => {
      district.villages.forEach(village => {
        acc.functional += village.functional;
        acc.needsRepair += village.needsRepair;
        acc.nonFunctional += village.nonFunctional;
      });
    });
    return acc;
  }, { functional: 0, needsRepair: 0, nonFunctional: 0 });

  const statusChartData = [
    { name: "Functional", value: statusDistribution.functional, color: "#22c55e" },
    { name: "Needs Repair", value: statusDistribution.needsRepair, color: "#f97316" },
    { name: "Non-Functional", value: statusDistribution.nonFunctional, color: "#ef4444" },
  ];

  // Calculate overall stats
  const overallStats = {
    totalSources: SOMALILAND_REGIONS.reduce((sum, region) => sum + region.totalSources, 0),
    avgStatus: Math.round(SOMALILAND_REGIONS.reduce((sum, region) => sum + region.avgStatus, 0) / SOMALILAND_REGIONS.length),
    totalVillages: SOMALILAND_REGIONS.reduce((sum, region) => 
      sum + region.districts.reduce((dSum, district) => dSum + district.villages.length, 0), 0
    ),
    totalDistricts: SOMALILAND_REGIONS.reduce((sum, region) => sum + region.districts.length, 0)
  };

  // Toggle functions with proper state management
  const toggleRegion = (regionName: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionName)) {
      newExpanded.delete(regionName);
      // Collapse all children when collapsing region
      setExpandedDistricts(new Set());
      setExpandedVillages(new Set());
    } else {
      newExpanded.add(regionName);
    }
    setExpandedRegions(newExpanded);
  };

  const toggleDistrict = (districtName: string) => {
    const newExpanded = new Set(expandedDistricts);
    if (newExpanded.has(districtName)) {
      newExpanded.delete(districtName);
      // Collapse village when collapsing district
      const newVillageExpanded = new Set(expandedVillages);
      currentDistrict?.villages.forEach(village => {
        newVillageExpanded.delete(village.name);
      });
      setExpandedVillages(newVillageExpanded);
    } else {
      newExpanded.add(districtName);
    }
    setExpandedDistricts(newExpanded);
  };

  const toggleVillage = (villageName: string) => {
    const newExpanded = new Set(expandedVillages);
    if (newExpanded.has(villageName)) {
      newExpanded.delete(villageName);
    } else {
      newExpanded.add(villageName);
    }
    setExpandedVillages(newExpanded);
  };

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    if (!expandedRegions.has(regionName)) {
      toggleRegion(regionName);
    }
  };

  const handleDistrictSelect = (districtName: string) => {
    setSelectedDistrict(districtName);
    setSelectedVillage(null);
    if (!expandedDistricts.has(districtName)) {
      toggleDistrict(districtName);
    }
  };

  const handleVillageSelect = (villageName: string) => {
    setSelectedVillage(villageName);
    if (!expandedVillages.has(villageName)) {
      toggleVillage(villageName);
    }
  };

  const handleBackToRegions = () => {
    setSelectedRegion(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setExpandedRegions(new Set());
    setExpandedDistricts(new Set());
    setExpandedVillages(new Set());
  };

  const handleBackToDistricts = () => {
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setExpandedDistricts(new Set());
    setExpandedVillages(new Set());
  };

  const handleBackToVillages = () => {
    setSelectedVillage(null);
    setExpandedVillages(new Set());
  };

  // Get filtered sources
  const getFilteredSources = () => {
    if (!currentVillage) return [];
    
    return currentVillage.sources.filter(source => {
      if (statusFilter !== 'all' && source.status !== statusFilter) return false;
      if (typeFilter !== 'all' && source.water_source_type !== typeFilter) return false;
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Somaliland Water Sources Dashboard</h1>
              <p className="text-gray-600">Monitoring {overallStats.totalSources} water sources across {SOMALILAND_REGIONS.length} regions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search region, district, or village..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
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
              Hierarchy View
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
              Analytics View
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
                  <p className="text-sm font-medium text-gray-600">Total Water Sources</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalSources.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Droplet className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Across {SOMALILAND_REGIONS.length} regions</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Functionality</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.avgStatus}%</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Average across all regions</div>
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
              <div className="mt-2 text-xs text-gray-500">In {overallStats.totalDistricts} districts</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
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
        {(selectedRegion || selectedDistrict || selectedVillage) && (
          <div className="flex items-center gap-2 mb-6 text-sm bg-white p-3 rounded-lg border border-gray-200">
            <button 
              onClick={handleBackToRegions}
              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              All Regions
            </button>
            {selectedRegion && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button 
                  onClick={selectedDistrict || selectedVillage ? handleBackToDistricts : undefined}
                  className={`flex items-center gap-1 ${selectedDistrict || selectedVillage ? 'text-blue-600 hover:text-blue-800 hover:underline' : 'text-gray-900'}`}
                >
                  {selectedRegion}
                </button>
              </>
            )}
            {selectedDistrict && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button 
                  onClick={selectedVillage ? handleBackToVillages : undefined}
                  className={`flex items-center gap-1 ${selectedVillage ? 'text-blue-600 hover:text-blue-800 hover:underline' : 'text-gray-900'}`}
                >
                  {selectedDistrict}
                </button>
              </>
            )}
            {selectedVillage && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{selectedVillage}</span>
              </>
            )}
          </div>
        )}

        {/* Main Content */}
        {viewMode === 'charts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Region Comparison Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Region Performance Comparison</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={12} />
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Status Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Sources']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution Map</h3>
            <div className="h-96 rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map would appear here</p>
                <p className="text-sm text-gray-500 mt-2">Showing all {overallStats.totalSources} water sources</p>
              </div>
            </div>
          </div>
        ) : (
          /* Hierarchy View */
          <div className="space-y-4">
            {/* Region Cards with Expand/Collapse */}
            {!selectedRegion ? (
              // All Regions View
              SOMALILAND_REGIONS.map(region => (
                <div key={region.region} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Region Header - Clickable */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleRegionSelect(region.region)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRegion(region.region);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedRegions.has(region.region) ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
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
                  
                  {/* Expanded Region Content */}
                  {expandedRegions.has(region.region) && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Districts in {region.region}</h4>
                        <div className="space-y-3">
                          {region.districts.map(district => (
                            <div 
                              key={district.name}
                              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                              onClick={() => handleDistrictSelect(district.name)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDistrict(district.name);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    {expandedDistricts.has(district.name) ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                  <div>
                                    <h5 className="font-medium text-gray-900">{district.name}</h5>
                                    <p className="text-sm text-gray-600">{district.totalSources} sources</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-gray-900">{district.avgStatus}%</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : !selectedDistrict ? (
              // Selected Region - Districts View
              currentRegion?.districts.map(district => (
                <div key={district.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* District Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleDistrictSelect(district.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDistrict(district.name);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedDistricts.has(district.name) ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
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
                  </div>
                  
                  {/* Expanded District Content */}
                  {expandedDistricts.has(district.name) && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Villages in {district.name}</h4>
                        <div className="space-y-3">
                          {district.villages.map(village => (
                            <div 
                              key={village.name}
                              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors"
                              onClick={() => handleVillageSelect(village.name)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleVillage(village.name);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    {expandedVillages.has(village.name) ? (
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                  <div>
                                    <h5 className="font-medium text-gray-900">{village.name}</h5>
                                    <p className="text-sm text-gray-600">{village.totalSources} water sources</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-gray-900">{village.avgStatus}%</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : !selectedVillage ? (
              // Selected District - Villages View
              currentDistrict?.villages.map(village => (
                <div key={village.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Village Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleVillageSelect(village.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVillage(village.name);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedVillages.has(village.name) ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <MapPin className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{village.name}</h3>
                          <p className="text-sm text-gray-600">
                            Water sources breakdown
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{village.avgStatus}%</div>
                        <div className="text-sm text-gray-600">Status Score</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Village Content */}
                  {expandedVillages.has(village.name) && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-4">Water Sources in {village.name}</h4>
                        
                        {/* Filters */}
                        <div className="flex gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <FilterIcon className="w-4 h-4 text-gray-500" />
                            <select 
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">All Status</option>
                              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <FilterIcon className="w-4 h-4 text-gray-500" />
                            <select 
                              value={typeFilter}
                              onChange={(e) => setTypeFilter(e.target.value)}
                              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">All Types</option>
                              {Object.keys(WATER_SOURCE_TYPES).map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        {/* Sources List */}
                        <div className="space-y-3">
                          {getFilteredSources().map(source => {
                            const SourceIcon = WATER_SOURCE_TYPES[source.water_source_type as keyof typeof WATER_SOURCE_TYPES]?.icon || Droplet;
                            const statusConfig = STATUS_CONFIG[source.status as keyof typeof STATUS_CONFIG];
                            const StatusIcon = statusConfig?.icon || AlertCircle;
                            
                            return (
                              <div key={source.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${WATER_SOURCE_TYPES[source.water_source_type as keyof typeof WATER_SOURCE_TYPES]?.bgColor || 'bg-gray-50'}`}>
                                      <SourceIcon className={`w-5 h-5 ${WATER_SOURCE_TYPES[source.water_source_type as keyof typeof WATER_SOURCE_TYPES]?.color || 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-gray-900">{source.source_name}</h5>
                                      <p className="text-sm text-gray-600 capitalize">{source.water_source_type.toLowerCase()}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600">
                                        {source.lat.toFixed(4)}, {source.lng.toFixed(4)}
                                      </div>
                                      <div className="text-xs text-gray-500">Coordinates</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusConfig?.bgColor} ${statusConfig?.color}`}>
                                      <StatusIcon className="w-3 h-3" />
                                      {statusConfig?.label}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Individual Village Detailed View
              currentVillage && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{currentVillage.name}</h2>
                        <p className="text-gray-600">Village in {selectedDistrict}, {selectedRegion}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{currentVillage.avgStatus}%</div>
                        <div className="text-sm text-gray-600">Overall Status Score</div>
                      </div>
                    </div>
                    
                    {/* Detailed Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-700">{currentVillage.functional}</div>
                            <div className="text-sm text-green-600">Functional</div>
                          </div>
                        </div>
                        <div className="text-sm text-green-800">
                          {((currentVillage.functional / currentVillage.totalSources) * 100).toFixed(1)}% of total sources
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-orange-100 rounded-lg">
                            <Wrench className="w-6 h-6 text-orange-600" />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-700">{currentVillage.needsRepair}</div>
                            <div className="text-sm text-orange-600">Needs Repair</div>
                          </div>
                        </div>
                        <div className="text-sm text-orange-800">
                          {((currentVillage.needsRepair / currentVillage.totalSources) * 100).toFixed(1)}% of total sources
                        </div>
                      </div>
                      
                      <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-red-100 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-700">{currentVillage.nonFunctional}</div>
                            <div className="text-sm text-red-600">Non-Functional</div>
                          </div>
                        </div>
                        <div className="text-sm text-red-800">
                          {((currentVillage.nonFunctional / currentVillage.totalSources) * 100).toFixed(1)}% of total sources
                        </div>
                      </div>
                    </div>
                    
                    {/* Individual Sources */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Sources ({currentVillage.sources.length})</h3>
                      <div className="space-y-3">
                        {currentVillage.sources.map(source => {
                          const SourceIcon = WATER_SOURCE_TYPES[source.water_source_type as keyof typeof WATER_SOURCE_TYPES]?.icon || Droplet;
                          const statusConfig = STATUS_CONFIG[source.status as keyof typeof STATUS_CONFIG];
                          const StatusIcon = statusConfig?.icon || AlertCircle;
                          
                          return (
                            <div key={source.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-lg ${WATER_SOURCE_TYPES[source.water_source_type as keyof typeof WATER_SOURCE_TYPES]?.bgColor || 'bg-gray-50'}`}>
                                    <SourceIcon className={`w-6 h-6 ${WATER_SOURCE_TYPES[source.water_source_type as keyof typeof WATER_SOURCE_TYPES]?.color || 'text-gray-500'}`} />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{source.source_name}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                      <span className="text-sm text-gray-600 capitalize">{source.water_source_type.toLowerCase()}</span>
                                      <span className="text-sm text-gray-500">
                                        {source.lat.toFixed(4)}, {source.lng.toFixed(4)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${statusConfig?.bgColor} ${statusConfig?.color}`}>
                                  <StatusIcon className="w-4 h-4" />
                                  {statusConfig?.label}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        View Detailed Report
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Schedule Maintenance
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Add New Source
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}