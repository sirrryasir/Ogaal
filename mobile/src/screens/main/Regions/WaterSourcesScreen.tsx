import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather, FontAwesome5, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Typography from '../../../components/Typography';

const { width, height } = Dimensions.get('window');

interface WaterSourceParams {
  districtId: string;
  districtName: string;
  regionName: string;
}

interface WaterSource {
  id: string;
  name: string;
  type: 'borehole' | 'well' | 'spring' | 'reservoir' | 'pipeline';
  status: 'working' | 'needs-repair' | 'not-working' | 'under-maintenance';
  capacity: number; // liters per day
  depth: number; // meters
  waterQuality: 'excellent' | 'good' | 'fair' | 'poor';
  populationServed: number;
  lastMaintenance: string; // ISO date string
  nextMaintenance: string; // ISO date string
  location: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  description?: string;
}

interface FilterState {
  status: string | null;
  type: string | null;
  quality: string | null;
}

const WaterSourcesScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { districtId, districtName, regionName } = route.params as WaterSourceParams;
  const mapRef = useRef<MapView>(null);

  const [waterSources, setWaterSources] = useState<WaterSource[]>([]);
  const [filteredSources, setFilteredSources] = useState<WaterSource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [showMapModal, setShowMapModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [filters, setFilters] = useState<FilterState>({ status: null, type: null, quality: null });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(null);
  const [region] = useState({
    latitude: 9.5624,
    longitude: 44.0770,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  useEffect(() => {
    loadWaterSources();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, waterSources]);

  const loadWaterSources = () => {
    // Mock data - in real app, fetch from API
    const mockData: WaterSource[] = [
      {
        id: '1',
        name: 'Hargeisa Main Borehole',
        type: 'borehole',
        status: 'working',
        capacity: 50000,
        depth: 150,
        waterQuality: 'good',
        populationServed: 15000,
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-07-15',
        location: { latitude: 9.5624, longitude: 44.0770 },
        address: '26 June District, Hargeisa',
        description: 'Primary water source for central Hargeisa'
      },
      {
        id: '2',
        name: 'Gabiley Spring Source',
        type: 'spring',
        status: 'working',
        capacity: 20000,
        depth: 0,
        waterQuality: 'excellent',
        populationServed: 8000,
        lastMaintenance: '2024-02-01',
        nextMaintenance: '2024-08-01',
        location: { latitude: 9.5789, longitude: 44.0698 },
        address: 'Gabiley Central',
        description: 'Natural spring with good flow rate'
      },
      {
        id: '3',
        name: 'Ahmed Dhagah Well',
        type: 'well',
        status: 'needs-repair',
        capacity: 10000,
        depth: 40,
        waterQuality: 'fair',
        populationServed: 5000,
        lastMaintenance: '2023-11-20',
        nextMaintenance: '2024-05-20',
        location: { latitude: 9.5550, longitude: 44.0850 },
        address: 'Ahmed Dhagah District',
        description: 'Hand pump needs replacement'
      },
      {
        id: '4',
        name: 'Ibrahim Kodbuur Reservoir',
        type: 'reservoir',
        status: 'working',
        capacity: 100000,
        depth: 0,
        waterQuality: 'good',
        populationServed: 20000,
        lastMaintenance: '2024-01-30',
        nextMaintenance: '2024-07-30',
        location: { latitude: 9.5700, longitude: 44.0920 },
        address: 'Ibrahim Kodbuur Area',
        description: 'Water storage for northern districts'
      },
      {
        id: '5',
        name: 'Gacan Libaax Pipeline',
        type: 'pipeline',
        status: 'under-maintenance',
        capacity: 75000,
        depth: 0,
        waterQuality: 'good',
        populationServed: 12000,
        lastMaintenance: '2024-02-10',
        nextMaintenance: '2024-08-10',
        location: { latitude: 9.5650, longitude: 44.0650 },
        address: 'Gacan Libaax Junction',
        description: 'Main distribution pipeline'
      },
      {
        id: '6',
        name: 'Wadajir Deep Borehole',
        type: 'borehole',
        status: 'not-working',
        capacity: 40000,
        depth: 200,
        waterQuality: 'poor',
        populationServed: 0,
        lastMaintenance: '2023-09-15',
        nextMaintenance: '2024-03-15',
        location: { latitude: 9.5480, longitude: 44.0780 },
        address: 'Wadajir District',
        description: 'Pump motor failed, needs replacement'
      },
      {
        id: '7',
        name: 'Hodan Community Well',
        type: 'well',
        status: 'working',
        capacity: 15000,
        depth: 35,
        waterQuality: 'excellent',
        populationServed: 7000,
        lastMaintenance: '2024-02-05',
        nextMaintenance: '2024-08-05',
        location: { latitude: 9.5600, longitude: 44.1000 },
        address: 'Hodan Center',
        description: 'Community-managed water point'
      },
      {
        id: '8',
        name: 'Dhagax Tur Spring',
        type: 'spring',
        status: 'working',
        capacity: 12000,
        depth: 0,
        waterQuality: 'good',
        populationServed: 6000,
        lastMaintenance: '2024-01-20',
        nextMaintenance: '2024-07-20',
        location: { latitude: 9.5750, longitude: 44.0720 },
        address: 'Dhagax Tur Area',
        description: 'Seasonal spring with consistent flow'
      },
    ];

    setWaterSources(mockData);
    setFilteredSources(mockData);
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserLocation(region);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log('Location error:', error);
      setUserLocation(region);
    }
  };

  const applyFilters = () => {
    let filtered = waterSources;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(source =>
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(source => source.status === filters.status);
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(source => source.type === filters.type);
    }

    // Apply quality filter
    if (filters.quality) {
      filtered = filtered.filter(source => source.waterQuality === filters.quality);
    }

    setFilteredSources(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return '#10b981';
      case 'needs-repair': return '#f59e0b';
      case 'not-working': return '#ef4444';
      case 'under-maintenance': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return 'check-circle';
      case 'needs-repair': return 'build';
      case 'not-working': return 'error';
      case 'under-maintenance': return 'engineering';
      default: return 'help';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'borehole': return 'water-damage';
      case 'well': return 'waves';
      case 'spring': return 'water';
      case 'reservoir': return 'inventory';
      case 'pipeline': return 'compare-arrows';
      default: return 'water-drop';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return '#10b981';
      case 'good': return '#84cc16';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getCapacityLabel = (capacity: number) => {
    if (capacity >= 1000000) return `${(capacity / 1000000).toFixed(1)}M L/day`;
    if (capacity >= 1000) return `${(capacity / 1000).toFixed(0)}K L/day`;
    return `${capacity} L/day`;
  };

  const handleGoBack = () => navigation.goBack();
  const handleSourcePress = (source: WaterSource) => {
    (navigation as any).navigate('SourceDetails', { 
      sourceId: source.id,
      sourceName: source.name,
      districtName,
      regionName
    });
  };

  const handleMapPress = (source: WaterSource) => {
    setSelectedSource(source);
    setShowMapModal(true);
    
    // Center map on selected source
    setTimeout(() => {
      mapRef.current?.animateToRegion({
        latitude: source.location.latitude,
        longitude: source.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }, 100);
  };

  const handleFilterPress = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }));
  };

  const clearFilters = () => {
    setFilters({ status: null, type: null, quality: null });
  };

  const getWorkingSourcesCount = () => {
    return waterSources.filter(s => s.status === 'working').length;
  };

  const getTotalCapacity = () => {
    return waterSources.reduce((sum, source) => sum + source.capacity, 0);
  };

  const getTotalPopulationServed = () => {
    return waterSources.reduce((sum, source) => sum + source.populationServed, 0);
  };

  const renderWaterSourceCard = ({ item }: { item: WaterSource }) => {
    return (
      <TouchableOpacity
        style={styles.sourceCard}
        onPress={() => handleSourcePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.sourceCardHeader}>
          <View style={styles.sourceTitleContainer}>
            <View style={[styles.sourceIcon, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <MaterialIcons name={getTypeIcon(item.type) as any} size={20} color={getStatusColor(item.status)} />
            </View>
            <View style={styles.sourceTitle}>
              <Typography variant="h3" style={styles.sourceName}>
                {item.name}
              </Typography>
              {item.address && (
                <Typography variant="caption" style={styles.sourceAddress}>
                  {item.address}
                </Typography>
              )}
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <MaterialIcons name={getStatusIcon(item.status) as any} size={14} color={getStatusColor(item.status)} />
            <Typography variant="caption" style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.replace('-', ' ').toUpperCase()}
            </Typography>
          </View>
        </View>

        {item.description && (
          <Typography variant="caption" style={styles.sourceDescription}>
            {item.description}
          </Typography>
        )}

        <View style={styles.sourceStats}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Feather name="droplet" size={14} color="#64748b" />
              <Typography variant="caption" style={styles.statLabel}>
                Capacity
              </Typography>
              <Typography variant="body" style={styles.statValue}>
                {getCapacityLabel(item.capacity)}
              </Typography>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="people" size={14} color="#64748b" />
              <Typography variant="caption" style={styles.statLabel}>
                Serves
              </Typography>
              <Typography variant="body" style={styles.statValue}>
                {item.populationServed.toLocaleString()}
              </Typography>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="water-damage" size={14} color="#64748b" />
              <Typography variant="caption" style={styles.statLabel}>
                Depth
              </Typography>
              <Typography variant="body" style={styles.statValue}>
                {item.depth}m
              </Typography>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <FontAwesome5 name="vial" size={14} color="#64748b" />
              <Typography variant="caption" style={styles.statLabel}>
                Quality
              </Typography>
              <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(item.waterQuality) + '15' }]}>
                <Typography variant="caption" style={[styles.qualityText, { color: getQualityColor(item.waterQuality) }]}>
                  {item.waterQuality.toUpperCase()}
                </Typography>
              </View>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="calendar-today" size={14} color="#64748b" />
              <Typography variant="caption" style={styles.statLabel}>
                Next Maintenance.
              </Typography>
              <Typography variant="caption" style={styles.statValue}>
                {formatDate(item.nextMaintenance)}
              </Typography>
            </View>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => handleMapPress(item)}
            >
              <Entypo name="location-pin" size={16} color="#0c6dff" />
              <Typography variant="caption" style={styles.mapButtonText}>
                View Map
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.viewDetailsButton}>
          <Typography variant="caption" style={styles.viewDetailsText}>
            View Details
          </Typography>
          <MaterialIcons name="arrow-forward" size={16} color="#0c6dff" />
        </View> */}
      </TouchableOpacity>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {waterSources.map((source) => (
          <Marker
            key={source.id}
            coordinate={source.location}
            title={source.name}
            description={`Status: ${source.status} | Type: ${source.type}`}
            onPress={() => setSelectedSource(source)}
          >
            <View style={[
              styles.markerContainer,
              { backgroundColor: getStatusColor(source.status) }
            ]}>
              <MaterialIcons 
                name={getTypeIcon(source.type) as any} 
                size={20} 
                color="white" 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedSource && (
        <View style={styles.mapInfoCard}>
          <View style={styles.mapInfoHeader}>
            <Typography variant="h3" style={styles.mapInfoTitle}>
              {selectedSource.name}
            </Typography>
            <TouchableOpacity onPress={() => setSelectedSource(null)}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <Typography variant="caption" style={styles.mapInfoAddress}>
            {selectedSource.address}
          </Typography>
          <View style={styles.mapInfoStats}>
            <View style={styles.mapInfoStat}>
              <Typography variant="caption" style={styles.mapInfoStatLabel}>
                Status
              </Typography>
              <View style={[styles.mapInfoStatus, { backgroundColor: getStatusColor(selectedSource.status) + '15' }]}>
                <Typography variant="caption" style={[styles.mapInfoStatusText, { color: getStatusColor(selectedSource.status) }]}>
                  {selectedSource.status.replace('-', ' ').toUpperCase()}
                </Typography>
              </View>
            </View>
            <View style={styles.mapInfoStat}>
              <Typography variant="caption" style={styles.mapInfoStatLabel}>
                Capacity
              </Typography>
              <Typography variant="body" style={styles.mapInfoStatValue}>
                {getCapacityLabel(selectedSource.capacity)}
              </Typography>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewSourceButton}
            onPress={() => {
              setShowMapModal(false);
              handleSourcePress(selectedSource);
            }}
          >
            <Typography variant="caption" style={styles.viewSourceButtonText}>
              View Source Details
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={['#0c6dff', '#4f46e5']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Typography style={styles.headerSubtitle}>
              Water Sources in {districtName}
            </Typography>
            <Typography style={styles.headerTitle}>
              {regionName}
            </Typography>
          </View>
          
          <TouchableOpacity 
            style={styles.viewToggleButton}
            onPress={() => setActiveView(activeView === 'list' ? 'map' : 'list')}
          >
            <MaterialIcons 
              name={activeView === 'list' ? 'map' : 'list'} 
              size={22} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <MaterialIcons name="water" size={20} color="white" />
            <Typography style={styles.quickStatValue}>
              {waterSources.length}
            </Typography>
            <Typography style={styles.quickStatLabel}>Sources</Typography>
          </View>
          <View style={styles.quickStatItem}>
            <MaterialIcons name="check-circle" size={20} color="white" />
            <Typography style={styles.quickStatValue}>
              {getWorkingSourcesCount()}
            </Typography>
            <Typography style={styles.quickStatLabel}>Working</Typography>
          </View>
          <View style={styles.quickStatItem}>
            <Feather name="droplet" size={20} color="white" />
            <Typography style={styles.quickStatValue}>
              {getCapacityLabel(getTotalCapacity())}
            </Typography>
            <Typography style={styles.quickStatLabel}>Capacity</Typography>
          </View>
          <View style={styles.quickStatItem}>
            <MaterialIcons name="people" size={20} color="white" />
            <Typography style={styles.quickStatValue}>
              {getTotalPopulationServed().toLocaleString()}
            </Typography>
            <Typography style={styles.quickStatLabel}>Served</Typography>
          </View>
        </View>
      </LinearGradient>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search water sources..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <MaterialIcons 
              name="filter-list" 
              size={20} 
              color={Object.values(filters).some(f => f !== null) ? '#0c6dff' : '#64748b'} 
            />
            {Object.values(filters).some(f => f !== null) && (
              <View style={styles.filterDot} />
            )}
          </TouchableOpacity>
        </View>

        {/* Filters Panel */}
        {showFilters && (
          <View style={styles.filtersPanel}>
            <View style={styles.filterSection}>
              <Typography variant="caption" style={styles.filterSectionTitle}>
                Status
              </Typography>
              <View style={styles.filterOptions}>
                {['working', 'needs-repair', 'not-working', 'under-maintenance'].map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      filters.status === status && { backgroundColor: getStatusColor(status) + '15' }
                    ]}
                    onPress={() => handleFilterPress('status', status)}
                  >
                    <MaterialIcons 
                      name={getStatusIcon(status) as any} 
                      size={16} 
                      color={filters.status === status ? getStatusColor(status) : '#64748b'} 
                    />
                    <Typography 
                      variant="caption" 
                      style={[
                        styles.filterOptionText,
                        filters.status === status && { color: getStatusColor(status) }
                      ]}
                    >
                      {status.replace('-', ' ')}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Typography variant="caption" style={styles.filterSectionTitle}>
                Type
              </Typography>
              <View style={styles.filterOptions}>
                {['borehole', 'well', 'spring', 'reservoir', 'pipeline'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filters.type === type && { backgroundColor: '#0c6dff15' }
                    ]}
                    onPress={() => handleFilterPress('type', type)}
                  >
                    <MaterialIcons 
                      name={getTypeIcon(type) as any} 
                      size={16} 
                      color={filters.type === type ? '#0c6dff' : '#64748b'} 
                    />
                    <Typography 
                      variant="caption" 
                      style={[
                        styles.filterOptionText,
                        filters.type === type && { color: '#0c6dff' }
                      ]}
                    >
                      {type}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Typography variant="caption" style={styles.filterSectionTitle}>
                Water Quality
              </Typography>
              <View style={styles.filterOptions}>
                {['excellent', 'good', 'fair', 'poor'].map(quality => (
                  <TouchableOpacity
                    key={quality}
                    style={[
                      styles.filterOption,
                      filters.quality === quality && { backgroundColor: getQualityColor(quality) + '15' }
                    ]}
                    onPress={() => handleFilterPress('quality', quality)}
                  >
                    <FontAwesome5 
                      name="vial" 
                      size={14} 
                      color={filters.quality === quality ? getQualityColor(quality) : '#64748b'} 
                    />
                    <Typography 
                      variant="caption" 
                      style={[
                        styles.filterOptionText,
                        filters.quality === quality && { color: getQualityColor(quality) }
                      ]}
                    >
                      {quality}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                <Typography variant="caption" style={styles.clearFiltersText}>
                  Clear All Filters
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={() => setShowFilters(false)}
              >
                <Typography variant="caption" style={styles.applyFiltersText}>
                  Apply Filters
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Main Content - List or Map */}
      {activeView === 'list' ? (
        <FlatList
          data={filteredSources}
          renderItem={renderWaterSourceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sourcesList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Typography variant="body" style={styles.resultsCount}>
                {filteredSources.length} water sources found
              </Typography>
              {Object.values(filters).some(f => f !== null) && (
                <TouchableOpacity onPress={clearFilters}>
                  <Typography variant="caption" style={styles.clearFiltersLink}>
                    Clear filters
                  </Typography>
                </TouchableOpacity>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="water-damage" size={48} color="#e2e8f0" />
              <Typography variant="h3" style={styles.emptyTitle}>
                No water sources found
              </Typography>
              <Typography variant="body" style={styles.emptyText}>
                Try adjusting your search or filters
              </Typography>
              <TouchableOpacity style={styles.resetButton} onPress={() => {
                setSearchQuery('');
                clearFilters();
              }}>
                <Typography variant="caption" style={styles.resetButtonText}>
                  Reset Search & Filters
                </Typography>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <View style={styles.mapViewContainer}>
          {renderMapView()}
          <TouchableOpacity 
            style={styles.fullMapButton}
            onPress={() => setShowMapModal(true)}
          >
            <MaterialIcons name="fullscreen" size={20} color="white" />
            <Typography variant="caption" style={styles.fullMapText}>
              Full Screen Map
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      {/* Full Screen Map Modal */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={styles.fullMapModal}>
          <LinearGradient 
            colors={['#0c6dff', '#4f46e5']} 
            style={styles.mapHeader}
          >
            <View style={styles.mapHeaderContent}>
              <TouchableOpacity style={styles.backButton} onPress={() => setShowMapModal(false)}>
                <Feather name="arrow-left" size={22} color="white" />
              </TouchableOpacity>
              <Typography style={styles.mapHeaderTitle}>
                Water Sources Map - {districtName}
              </Typography>
              <View style={styles.placeholder} />
            </View>
          </LinearGradient>
          {renderMapView()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  viewToggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  placeholder: {
    width: 44,
  },
  // Quick Stats
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  quickStatLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Search Container
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    paddingVertical: 0,
  },
  filterButton: {
    padding: 4,
    position: 'relative',
  },
  filterDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  // Filters Panel
  filtersPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  applyFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0c6dff',
  },
  applyFiltersText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  // Sources List
  sourcesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  clearFiltersLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0c6dff',
  },
  // Source Card
  sourceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sourceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sourceTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  sourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sourceTitle: {
    flex: 1,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  sourceAddress: {
    fontSize: 12,
    color: '#64748b',
  },
  sourceDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Source Stats
  sourceStats: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  qualityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qualityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0c6dff',
  },
  // View Details Button
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginTop: 16,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0c6dff',
    marginRight: 8,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0c6dff',
  },
  // Map View
  mapViewContainer: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mapInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  mapInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mapInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  mapInfoAddress: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  mapInfoStats: {
    flexDirection: 'row',
    gap: 16,
  },
  mapInfoStat: {
    flex: 1,
  },
  mapInfoStatLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  mapInfoStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mapInfoStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mapInfoStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  viewSourceButton: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0c6dff',
    marginTop: 12,
  },
  viewSourceButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  fullMapButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(12, 109, 255, 0.9)',
    gap: 8,
  },
  fullMapText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  // Full Screen Map Modal
  fullMapModal: {
    flex: 1,
  },
  mapHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  mapHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapHeaderTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
});

export default WaterSourcesScreen;