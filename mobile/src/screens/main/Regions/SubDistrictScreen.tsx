import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Typography from '../../../components/Typography';

const { width } = Dimensions.get('window');

interface SubDistrictParams {
  districtId: string;
  districtName: string;
  regionName: string;
  regionColor: string;
}

interface SubDistrict {
  id: string;
  name: string;
  type: 'urban' | 'rural' | 'mixed' | 'commercial' | 'residential';
  population: string;
  area: string;
  waterSources: number;
  workingSources: number;
  riskLevel: 'high' | 'medium' | 'low';
  location?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  villages?: string[];
}

interface DistrictStats {
  totalSubDistricts: number;
  totalWaterSources: number;
  workingSources: number;
  totalPopulation: string;
  totalArea: string;
}

type RootStackParamList = {
  WaterSources: {
    subDistrictId: string;
    subDistrictName: string;
    districtName: string;
    regionName: string;
    regionColor: string;
  };
  RegionDetails?: {
    districtId: string;
    districtName: string;
    regionName: string;
    regionColor: string;
  };
  // add other routes here as needed
};

// Blue color palette
const BLUE_PRIMARY = '#0c6dff';
const BLUE_DARK = '#0052cc';
const BLUE_LIGHT = '#3d8eff';
const BLUE_EXTRA_LIGHT = '#f0f7ff';
const BLUE_PALE = '#e6f0ff';

// Status colors in blue tones
const BLUE_HIGH = '#ff6b6b'; // Keep red for high risk
const BLUE_MEDIUM = '#ffa726'; // Keep orange for medium risk
const BLUE_LOW = '#4caf50'; // Keep green for low risk

// Neutral colors
const GRAY_DARK = '#1e293b';
const GRAY_MEDIUM = '#64748b';
const GRAY_LIGHT = '#94a3b8';
const GRAY_EXTRA_LIGHT = '#f1f5f9';
const WHITE = '#ffffff';

const SubDistrictsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { districtId, districtName, regionName, regionColor } = route.params as SubDistrictParams;

  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState<SubDistrict[]>([]);
  const [districtStats, setDistrictStats] = useState<DistrictStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [showMapModal, setShowMapModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<SubDistrict | null>(null);

  useEffect(() => {
    loadSubDistricts();
  }, [districtId]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilter, typeFilter, subDistricts]);

  const loadSubDistricts = () => {
    // Mock data - in real app, fetch from API
    const mockData: SubDistrict[] = [
      {
        id: '1',
        name: 'Hodan Center',
        type: 'urban',
        population: '45,000',
        area: '8.5 km²',
        waterSources: 12,
        workingSources: 9,
        riskLevel: 'medium',
        location: { latitude: 9.5624, longitude: 44.0770 },
        description: 'Central commercial and residential area',
        villages: ['Hodan Main', 'Hodan Market', 'Hodan Residential']
      },
      {
        id: '2',
        name: 'Wadajir North',
        type: 'mixed',
        population: '32,000',
        area: '12.3 km²',
        waterSources: 8,
        workingSources: 6,
        riskLevel: 'high',
        location: { latitude: 9.5789, longitude: 44.0698 },
        description: 'Mixed urban-rural area with growing population',
        villages: ['Wadajir Village', 'North Settlement', 'Green Fields']
      },
      {
        id: '3',
        name: 'Ahmed Dhagah Central',
        type: 'commercial',
        population: '28,000',
        area: '5.2 km²',
        waterSources: 10,
        workingSources: 8,
        riskLevel: 'low',
        location: { latitude: 9.5550, longitude: 44.0850 },
        description: 'Main commercial hub with established infrastructure',
        villages: ['Market Area', 'Business District', 'Commercial Zone']
      },
      {
        id: '4',
        name: 'Karaan South',
        type: 'rural',
        population: '15,000',
        area: '25.8 km²',
        waterSources: 6,
        workingSources: 4,
        riskLevel: 'high',
        location: { latitude: 9.5700, longitude: 44.0920 },
        description: 'Rural agricultural area with scattered settlements',
        villages: ['Karaan Farm', 'South Village', 'Rural Settlement']
      },
      {
        id: '5',
        name: 'Shangani Coastal',
        type: 'mixed',
        population: '22,000',
        area: '9.7 km²',
        waterSources: 7,
        workingSources: 5,
        riskLevel: 'medium',
        location: { latitude: 9.5650, longitude: 44.0650 },
        description: 'Coastal area with fishing communities',
        villages: ['Fishing Village', 'Coastal Community', 'Beach Area']
      },
      {
        id: '6',
        name: 'Bondhere East',
        type: 'residential',
        population: '38,000',
        area: '6.9 km²',
        waterSources: 9,
        workingSources: 7,
        riskLevel: 'low',
        location: { latitude: 9.5480, longitude: 44.0780 },
        description: 'Dense residential neighborhood',
        villages: ['East Residential', 'Family Homes', 'Community Area']
      },
      {
        id: '7',
        name: 'Dhagax Tur West',
        type: 'urban',
        population: '41,000',
        area: '7.8 km²',
        waterSources: 11,
        workingSources: 8,
        riskLevel: 'medium',
        location: { latitude: 9.5600, longitude: 44.1000 },
        description: 'Western urban expansion area',
        villages: ['West Expansion', 'New Settlement', 'Urban Zone']
      },
      {
        id: '8',
        name: 'Ibrahim Kodbuur Rural',
        type: 'rural',
        population: '12,000',
        area: '18.5 km²',
        waterSources: 5,
        workingSources: 3,
        riskLevel: 'high',
        location: { latitude: 9.5750, longitude: 44.0720 },
        description: 'Remote rural area with limited infrastructure',
        villages: ['Remote Village', 'Rural Farms', 'Outskirts']
      },
      {
        id: '9',
        name: 'Gacan Libaax Commercial',
        type: 'commercial',
        population: '19,000',
        area: '4.3 km²',
        waterSources: 6,
        workingSources: 5,
        riskLevel: 'low',
        location: { latitude: 9.5450, longitude: 44.0880 },
        description: 'Small commercial district with offices',
        villages: ['Office Park', 'Business Center', 'Commercial Hub']
      },
      {
        id: '10',
        name: '26 June Residential',
        type: 'residential',
        population: '52,000',
        area: '10.2 km²',
        waterSources: 14,
        workingSources: 11,
        riskLevel: 'medium',
        location: { latitude: 9.5500, longitude: 44.0950 },
        description: 'Large residential area with apartment complexes',
        villages: ['Apartment Zone', 'Residential Blocks', 'Housing Area']
      },
    ];

    // Calculate district stats
    const stats: DistrictStats = {
      totalSubDistricts: mockData.length,
      totalWaterSources: mockData.reduce((sum, sub) => sum + sub.waterSources, 0),
      workingSources: mockData.reduce((sum, sub) => sum + sub.workingSources, 0),
      totalPopulation: mockData.reduce((sum, sub) => sum + parseInt(sub.population.replace(',', '')), 0).toLocaleString(),
      totalArea: `${mockData.reduce((sum, sub) => sum + parseFloat(sub.area.split(' ')[0]), 0).toFixed(1)} km²`
    };

    setSubDistricts(mockData);
    setFilteredSubDistricts(mockData);
    setDistrictStats(stats);
  };

  const applyFilters = () => {
    let filtered = subDistricts;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(subDistrict =>
        subDistrict.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subDistrict.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subDistrict.villages?.some(village => village.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply risk level filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(subDistrict => subDistrict.riskLevel === activeFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(subDistrict => subDistrict.type === typeFilter);
    }

    setFilteredSubDistricts(filtered);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return BLUE_HIGH;
      case 'medium': return BLUE_MEDIUM;
      case 'low': return BLUE_LOW;
      default: return GRAY_MEDIUM;
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'check-circle';
      default: return 'help';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urban': return 'location-city';
      case 'rural': return 'nature-people';
      case 'mixed': return 'account-balance';
      case 'commercial': return 'store';
      case 'residential': return 'home';
      default: return 'map';
    }
  };

  const getTypeColor = (type: string) => {
    // All types use blue variations
    switch (type) {
      case 'urban': return BLUE_PRIMARY;
      case 'rural': return BLUE_LIGHT;
      case 'mixed': return BLUE_PRIMARY;
      case 'commercial': return BLUE_DARK;
      case 'residential': return BLUE_LIGHT;
      default: return BLUE_PRIMARY;
    }
  };

  const handleGoBack = () => navigation.goBack();
  const handleSubDistrictPress = (subDistrict: SubDistrict) => {
    navigation.navigate('WaterSources', {
      subDistrictId: subDistrict.id,
      subDistrictName: subDistrict.name,
      districtName,
      regionName,
      regionColor
    });
  };

  const handleMapPress = (subDistrict: SubDistrict) => {
    setSelectedSubDistrict(subDistrict);
    setShowMapModal(true);
  };

  const getWorkingPercentage = (subDistrict: SubDistrict) => {
    return Math.round((subDistrict.workingSources / subDistrict.waterSources) * 100);
  };

  const renderSubDistrictCard = ({ item }: { item: SubDistrict }) => {
    const workingPercentage = getWorkingPercentage(item);
    const efficiencyColor = workingPercentage >= 80 ? BLUE_LOW : 
                           workingPercentage >= 50 ? BLUE_MEDIUM : BLUE_HIGH;
    
    return (
      <TouchableOpacity
        style={styles.subDistrictCard}
        onPress={() => handleSubDistrictPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View style={[styles.typeIcon, { backgroundColor: BLUE_EXTRA_LIGHT }]}>
              <MaterialIcons name={getTypeIcon(item.type) as any} size={20} color={BLUE_PRIMARY} />
            </View>
            <View style={styles.titleContent}>
              <Typography variant="h3" style={styles.subDistrictName}>
                {item.name}
              </Typography>
              <Typography variant="caption" style={styles.subDistrictType}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Area
              </Typography>
            </View>
          </View>

          <View style={[styles.riskBadge, { backgroundColor: getRiskLevelColor(item.riskLevel) + '15' }]}>
            <MaterialIcons name={getRiskLevelIcon(item.riskLevel) as any} size={14} color={getRiskLevelColor(item.riskLevel)} />
            <Typography variant="caption" style={[styles.riskText, { color: getRiskLevelColor(item.riskLevel) }]}>
              {item.riskLevel.toUpperCase()}
            </Typography>
          </View>
        </View>

        {item.description && (
          <Typography variant="caption" style={styles.description}>
            {item.description}
          </Typography>
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MaterialIcons name="people" size={14} color={GRAY_MEDIUM} />
            <Typography variant="caption" style={styles.detailLabel}>Population</Typography>
            <Typography variant="body" style={styles.detailValue}>
              {item.population}
            </Typography>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="square-foot" size={14} color={GRAY_MEDIUM} />
            <Typography variant="caption" style={styles.detailLabel}>Area</Typography>
            <Typography variant="body" style={styles.detailValue}>
              {item.area}
            </Typography>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="water" size={14} color={GRAY_MEDIUM} />
            <Typography variant="caption" style={styles.detailLabel}>Sources</Typography>
            <Typography variant="body" style={styles.detailValue}>
              {item.waterSources}
            </Typography>
          </View>
        </View>

        {/* Villages Preview */}
        {item.villages && item.villages.length > 0 && (
          <View style={styles.villagesContainer}>
            <Typography variant="caption" style={styles.villagesLabel}>
              Villages:
            </Typography>
            <View style={styles.villagesList}>
              {item.villages.slice(0, 3).map((village, index) => (
                <View key={index} style={styles.villageTag}>
                  <Typography variant="caption" style={styles.villageName}>
                    {village}
                  </Typography>
                </View>
              ))}
              {item.villages.length > 3 && (
                <View style={styles.moreVillagesTag}>
                  <Typography variant="caption" style={styles.moreVillagesText}>
                    +{item.villages.length - 3} more
                  </Typography>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Typography variant="h1" style={[styles.statValue, { color: BLUE_PRIMARY }]}>
              {item.waterSources}
            </Typography>
            <Typography variant="caption" style={styles.statLabel}>Total Sources</Typography>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Typography variant="h1" style={[styles.statValue, { color: efficiencyColor }]}>
              {item.workingSources}
            </Typography>
            <Typography variant="caption" style={styles.statLabel}>Working</Typography>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: BLUE_EXTRA_LIGHT }]}
            onPress={() => handleSubDistrictPress(item)}
          >
            <MaterialIcons name="water" size={16} color={BLUE_PRIMARY} />
            <Typography variant="caption" style={[styles.actionText, { color: BLUE_PRIMARY }]}>
              View Water Sources
            </Typography>
          </TouchableOpacity>
          {item.location && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: GRAY_EXTRA_LIGHT }]}
              onPress={() => handleMapPress(item)}
            >
              <MaterialIcons name="map" size={16} color={GRAY_MEDIUM} />
              <Typography variant="caption" style={[styles.actionText, { color: GRAY_MEDIUM }]}>
                View on Map
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 9.5624,
          longitude: 44.0770,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
      >
        {subDistricts.map((subDistrict) => (
          subDistrict.location && (
            <Marker
              key={subDistrict.id}
              coordinate={subDistrict.location}
              title={subDistrict.name}
              description={`Type: ${subDistrict.type} | Risk: ${subDistrict.riskLevel}`}
              onPress={() => setSelectedSubDistrict(subDistrict)}
            >
              <View style={[
                styles.markerContainer,
                { backgroundColor: BLUE_PRIMARY }
              ]}>
                <MaterialIcons 
                  name={getTypeIcon(subDistrict.type) as any} 
                  size={20} 
                  color="white" 
                />
              </View>
            </Marker>
          )
        ))}
      </MapView>

      {selectedSubDistrict && (
        <View style={styles.mapInfoCard}>
          <View style={styles.mapInfoHeader}>
            <Typography variant="h3" style={styles.mapInfoTitle}>
              {selectedSubDistrict.name}
            </Typography>
            <TouchableOpacity onPress={() => setSelectedSubDistrict(null)}>
              <MaterialIcons name="close" size={24} color={GRAY_MEDIUM} />
            </TouchableOpacity>
          </View>
          <Typography variant="caption" style={styles.mapInfoDescription}>
            {selectedSubDistrict.description}
          </Typography>
          <View style={styles.mapInfoStats}>
            <View style={styles.mapInfoStat}>
              <Typography variant="caption" style={styles.mapInfoStatLabel}>
                Type
              </Typography>
              <View style={[styles.mapInfoType, { backgroundColor: BLUE_EXTRA_LIGHT }]}>
                <Typography variant="caption" style={[styles.mapInfoTypeText, { color: BLUE_PRIMARY }]}>
                  {selectedSubDistrict.type.toUpperCase()}
                </Typography>
              </View>
            </View>
            <View style={styles.mapInfoStat}>
              <Typography variant="caption" style={styles.mapInfoStatLabel}>
                Risk Level
              </Typography>
              <View style={[styles.mapInfoRisk, { backgroundColor: getRiskLevelColor(selectedSubDistrict.riskLevel) + '15' }]}>
                <Typography variant="caption" style={[styles.mapInfoRiskText, { color: getRiskLevelColor(selectedSubDistrict.riskLevel) }]}>
                  {selectedSubDistrict.riskLevel.toUpperCase()}
                </Typography>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewSubDistrictButton}
            onPress={() => {
              setShowMapModal(false);
              handleSubDistrictPress(selectedSubDistrict);
            }}
          >
            <Typography variant="caption" style={styles.viewSubDistrictButtonText}>
              View Sub-District Details
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const subDistrictTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'urban', label: 'Urban' },
    { value: 'rural', label: 'Rural' },
    { value: 'mixed', label: 'Mixed' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={[BLUE_PRIMARY, BLUE_DARK]} 
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
              Sub-Districts in {districtName}
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

        {/* District Stats */}
        {districtStats && (
          <View style={styles.districtStats}>
            <View style={styles.districtStatItem}>
              <MaterialIcons name="location-city" size={20} color="white" />
              <Typography style={styles.districtStatValue}>
                {districtStats.totalSubDistricts}
              </Typography>
              <Typography style={styles.districtStatLabel}>Sub-Districts</Typography>
            </View>
            <View style={styles.districtStatItem}>
              <MaterialIcons name="water" size={20} color="white" />
              <Typography style={styles.districtStatValue}>
                {districtStats.totalWaterSources}
              </Typography>
              <Typography style={styles.districtStatLabel}>Sources</Typography>
            </View>
            <View style={styles.districtStatItem}>
              <MaterialIcons name="trending-up" size={20} color="white" />
              <Typography style={styles.districtStatValue}>
                {districtStats.workingSources}
              </Typography>
              <Typography style={styles.districtStatLabel}>Working</Typography>
            </View>
            <View style={styles.districtStatItem}>
              <MaterialIcons name="people" size={20} color="white" />
              <Typography style={styles.districtStatValue}>
                {districtStats.totalPopulation}
              </Typography>
              <Typography style={styles.districtStatLabel}>Population</Typography>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={GRAY_MEDIUM} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sub-districts..."
            placeholderTextColor={GRAY_LIGHT}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={GRAY_MEDIUM} />
            </TouchableOpacity>
          )}
        </View>

        {/* Type Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeFilterContainer}
        >
          {subDistrictTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeFilterButton,
                typeFilter === type.value && { backgroundColor: BLUE_EXTRA_LIGHT }
              ]}
              onPress={() => setTypeFilter(type.value)}
            >
              <MaterialIcons 
                name={getTypeIcon(type.value)} 
                size={16} 
                color={typeFilter === type.value ? BLUE_PRIMARY : GRAY_MEDIUM} 
              />
              <Typography 
                variant="caption" 
                style={[
                  styles.typeFilterText,
                  typeFilter === type.value && { color: BLUE_PRIMARY }
                ]}
              >
                {type.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Risk Level Filter */}
        <View style={styles.riskFilterContainer}>
          <Typography variant="caption" style={styles.filterLabel}>
            Filter by Risk:
          </Typography>
          <View style={styles.riskFilterButtons}>
            <TouchableOpacity 
              style={[
                styles.riskFilterButton,
                activeFilter === 'all' && { backgroundColor: BLUE_EXTRA_LIGHT }
              ]}
              onPress={() => setActiveFilter('all')}
            >
              <Typography 
                variant="caption" 
                style={[
                  styles.riskFilterText,
                  activeFilter === 'all' && { color: BLUE_PRIMARY }
                ]}
              >
                All
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.riskFilterButton,
                activeFilter === 'high' && { backgroundColor: BLUE_HIGH + '15' }
              ]}
              onPress={() => setActiveFilter('high')}
            >
              <MaterialIcons name="warning" size={14} color={activeFilter === 'high' ? BLUE_HIGH : GRAY_MEDIUM} />
              <Typography 
                variant="caption" 
                style={[
                  styles.riskFilterText,
                  activeFilter === 'high' && { color: BLUE_HIGH }
                ]}
              >
                High Risk
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.riskFilterButton,
                activeFilter === 'medium' && { backgroundColor: BLUE_MEDIUM + '15' }
              ]}
              onPress={() => setActiveFilter('medium')}
            >
              <MaterialIcons name="info" size={14} color={activeFilter === 'medium' ? BLUE_MEDIUM : GRAY_MEDIUM} />
              <Typography 
                variant="caption" 
                style={[
                  styles.riskFilterText,
                  activeFilter === 'medium' && { color: BLUE_MEDIUM }
                ]}
              >
                Medium
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.riskFilterButton,
                activeFilter === 'low' && { backgroundColor: BLUE_LOW + '15' }
              ]}
              onPress={() => setActiveFilter('low')}
            >
              <MaterialIcons name="check-circle" size={14} color={activeFilter === 'low' ? BLUE_LOW : GRAY_MEDIUM} />
              <Typography 
                variant="caption" 
                style={[
                  styles.riskFilterText,
                  activeFilter === 'low' && { color: BLUE_LOW }
                ]}
              >
                Low Risk
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content - List or Map */}
      {activeView === 'list' ? (
        <FlatList
          data={filteredSubDistricts}
          renderItem={renderSubDistrictCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.subDistrictsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Typography variant="body" style={styles.resultsCount}>
                {filteredSubDistricts.length} sub-districts found
              </Typography>
              {(activeFilter !== 'all' || typeFilter !== 'all' || searchQuery.trim()) && (
                <TouchableOpacity onPress={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setTypeFilter('all');
                }}>
                  <Typography variant="caption" style={styles.clearFiltersLink}>
                    Clear filters
                  </Typography>
                </TouchableOpacity>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="location-off" size={48} color={GRAY_EXTRA_LIGHT} />
              <Typography variant="h3" style={styles.emptyTitle}>
                No sub-districts found
              </Typography>
              <Typography variant="body" style={styles.emptyText}>
                Try adjusting your search or filters
              </Typography>
              <TouchableOpacity style={styles.resetButton} onPress={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setTypeFilter('all');
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
            colors={[BLUE_PRIMARY, BLUE_DARK]} 
            style={styles.mapHeader}
          >
            <View style={styles.mapHeaderContent}>
              <TouchableOpacity style={styles.backButton} onPress={() => setShowMapModal(false)}>
                <Feather name="arrow-left" size={22} color="white" />
              </TouchableOpacity>
              <Typography style={styles.mapHeaderTitle}>
                Sub-Districts Map - {districtName}
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
    backgroundColor: GRAY_EXTRA_LIGHT,
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
  // District Stats
  districtStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  districtStatItem: {
    alignItems: 'center',
  },
  districtStatValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  districtStatLabel: {
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
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_EXTRA_LIGHT,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GRAY_EXTRA_LIGHT,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY_EXTRA_LIGHT,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: GRAY_DARK,
    paddingVertical: 0,
  },
  // Type Filter
  typeFilterContainer: {
    paddingBottom: 12,
  },
  typeFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: GRAY_EXTRA_LIGHT,
    gap: 6,
  },
  typeFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: GRAY_MEDIUM,
  },
  // Risk Filter
  riskFilterContainer: {
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: GRAY_MEDIUM,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  riskFilterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  riskFilterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GRAY_EXTRA_LIGHT,
    gap: 6,
  },
  riskFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: GRAY_MEDIUM,
  },
  // Sub-Districts List
  subDistrictsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: GRAY_MEDIUM,
  },
  clearFiltersLink: {
    fontSize: 12,
    fontWeight: '600',
    color: BLUE_PRIMARY,
  },
  // Sub-District Card
  subDistrictCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: GRAY_EXTRA_LIGHT,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContent: {
    flex: 1,
  },
  subDistrictName: {
    fontSize: 16,
    fontWeight: '700',
    color: GRAY_DARK,
    marginBottom: 4,
  },
  subDistrictType: {
    fontSize: 12,
    color: GRAY_MEDIUM,
    fontWeight: '500',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: GRAY_MEDIUM,
    lineHeight: 18,
    marginBottom: 16,
  },
  // Details Container
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: GRAY_MEDIUM,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: GRAY_DARK,
  },
  // Villages Container
  villagesContainer: {
    marginBottom: 16,
  },
  villagesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: GRAY_MEDIUM,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  villagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  villageTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: GRAY_EXTRA_LIGHT,
    borderWidth: 1,
    borderColor: GRAY_EXTRA_LIGHT,
  },
  villageName: {
    fontSize: 11,
    fontWeight: '500',
    color: GRAY_MEDIUM,
  },
  moreVillagesTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: GRAY_EXTRA_LIGHT,
    borderWidth: 1,
    borderColor: GRAY_EXTRA_LIGHT,
  },
  moreVillagesText: {
    fontSize: 11,
    fontWeight: '500',
    color: GRAY_LIGHT,
  },
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: GRAY_MEDIUM,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: GRAY_EXTRA_LIGHT,
  },
  // Actions Container
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: GRAY_EXTRA_LIGHT,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: GRAY_MEDIUM,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: GRAY_LIGHT,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: GRAY_EXTRA_LIGHT,
    borderWidth: 1,
    borderColor: GRAY_EXTRA_LIGHT,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: BLUE_PRIMARY,
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
    backgroundColor: WHITE,
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
    color: GRAY_DARK,
    flex: 1,
    marginRight: 12,
  },
  mapInfoDescription: {
    fontSize: 12,
    color: GRAY_MEDIUM,
    marginBottom: 12,
    lineHeight: 16,
  },
  mapInfoStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  mapInfoStat: {
    flex: 1,
  },
  mapInfoStatLabel: {
    fontSize: 11,
    color: GRAY_MEDIUM,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  mapInfoType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mapInfoTypeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mapInfoRisk: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mapInfoRiskText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewSubDistrictButton: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: BLUE_PRIMARY,
  },
  viewSubDistrictButtonText: {
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

export default SubDistrictsScreen;