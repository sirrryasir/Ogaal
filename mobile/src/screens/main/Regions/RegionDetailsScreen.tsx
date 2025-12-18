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
} from 'react-native';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Typography from '../../../components/Typography';

const { width } = Dimensions.get('window');

interface DistrictDetailsParams {
  regionId: string;
  regionName: string;
  regionColor: string;
}

interface District {
  id: string;
  name: string;
  waterSources: number;
  workingSources: number;
  population: string;
  area: string;
  riskLevel: 'high' | 'medium' | 'low';
  description?: string;
}

interface Region {
  id: string;
  name: string;
  color: string;
  totalDistricts: number;
  totalSources: number;
  workingSources: number;
  population: string;
  area: string;
  description: string;
  districts: District[];
}

type RootStackParamList = {
  WaterSources: { districtId: string; districtName: string; regionName: string };
  RegionDetails: { regionId: string; regionName: string; regionColor: string };
  SubDistrict: { districtId: string; districtName: string; regionName: string };
  // add other routes and their params here as needed
};

const DistrictDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RegionDetails'>>();
  const { regionId, regionName, regionColor } = route.params;

  const [regionData, setRegionData] = useState<Region | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockRegionData: Region = {
      id: regionId,
      name: regionName,
      color: regionColor,
      totalDistricts: 12,
      totalSources: 89,
      workingSources: 67,
      population: '1.2M',
      area: '2,100 km²',
      description: regionName === 'Hargeisa' 
        ? 'Capital region with diverse water infrastructure across multiple districts'
        : regionName === 'Gabiley'
        ? 'Agricultural region with stable water sources distributed across districts'
        : 'Region with varying water infrastructure across districts',
      districts: [
        { id: '1', name: '26 June District', waterSources: 15, workingSources: 12, population: '300K', area: '150 km²', riskLevel: 'medium', description: 'Central district with mixed water sources' },
        { id: '2', name: 'Ahmed Dhagah District', waterSources: 12, workingSources: 10, population: '250K', area: '120 km²', riskLevel: 'low', description: 'Residential area with good water coverage' },
        { id: '3', name: 'Ibrahim Kodbuur District', waterSources: 10, workingSources: 8, population: '200K', area: '180 km²', riskLevel: 'medium', description: 'Growing district with expanding infrastructure' },
        { id: '4', name: 'Gacan Libaax District', waterSources: 8, workingSources: 6, population: '180K', area: '140 km²', riskLevel: 'high', description: 'Arid district with water challenges' },
        { id: '5', name: 'Wadajir District', waterSources: 7, workingSources: 5, population: '150K', area: '110 km²', riskLevel: 'high', description: 'High density area with supply issues' },
        { id: '6', name: 'Hodan District', waterSources: 6, workingSources: 4, population: '120K', area: '90 km²', riskLevel: 'medium', description: 'Urban district with aging infrastructure' },
        { id: '7', name: 'Dhagax Tur District', waterSources: 5, workingSources: 4, population: '100K', area: '80 km²', riskLevel: 'low', description: 'Well-served residential district' },
        { id: '8', name: 'Kaah District', waterSources: 4, workingSources: 3, population: '90K', area: '70 km²', riskLevel: 'medium', description: 'Mixed urban-rural district' },
        { id: '9', name: 'Shibis District', waterSources: 3, workingSources: 2, population: '80K', area: '60 km²', riskLevel: 'high', description: 'Challenging water access area' },
        { id: '10', name: 'Shangani District', waterSources: 2, workingSources: 2, population: '70K', area: '50 km²', riskLevel: 'low', description: 'Small district with reliable water' },
        { id: '11', name: 'Bondhere District', waterSources: 2, workingSources: 1, population: '60K', area: '40 km²', riskLevel: 'medium', description: 'Developing district' },
        { id: '12', name: 'Karaan District', waterSources: 1, workingSources: 1, population: '50K', area: '30 km²', riskLevel: 'low', description: 'Rural district with basic services' },
      ]
    };
    
    // For other regions, generate different data
    if (regionName !== 'Hargeisa') {
      mockRegionData.districts = generateDistrictsForRegion(regionName);
      mockRegionData.totalDistricts = mockRegionData.districts.length;
      mockRegionData.totalSources = mockRegionData.districts.reduce((sum, d) => sum + d.waterSources, 0);
      mockRegionData.workingSources = mockRegionData.districts.reduce((sum, d) => sum + d.workingSources, 0);
    }
    
    setRegionData(mockRegionData);
    setFilteredDistricts(mockRegionData.districts);
  }, [regionId, regionName, regionColor]);

  useEffect(() => {
    if (!regionData) return;
    
    let filtered = regionData.districts;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(district =>
        district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        district.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply risk level filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(district => district.riskLevel === activeFilter);
    }
    
    setFilteredDistricts(filtered);
  }, [searchQuery, activeFilter, regionData]);

  const generateDistrictsForRegion = (regionName: string): District[] => {
    const baseNames = [
      'Central', 'North', 'South', 'East', 'West', 
      'Downtown', 'Uptown', 'Industrial', 'Residential', 'Commercial',
      'Rural', 'Suburban', 'Coastal', 'Mountain', 'Valley'
    ];
    
    return baseNames.slice(0, 8).map((name, index) => ({
      id: `${regionId}-${index + 1}`,
      name: `${regionName} ${name} District`,
      waterSources: Math.floor(Math.random() * 10) + 1,
      workingSources: Math.floor(Math.random() * 8) + 1,
      population: `${Math.floor(Math.random() * 200) + 50}K`,
      area: `${Math.floor(Math.random() * 150) + 30} km²`,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      description: `${name} area of ${regionName} with water infrastructure`
    }));
  };

  const handleGoBack = () => navigation.goBack();
  const handleDistrictPress = (district: District) => {
    // Navigate to district details or water sources list
    navigation.navigate('SubDistrict', { 
      districtId: district.id,
      districtName: district.name,
      regionName: regionName
    });
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
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

  const getWorkingPercentage = (district: District) => {
    return Math.round((district.workingSources / district.waterSources) * 100);
  };

  const renderDistrictCard = ({ item }: { item: District }) => {
    const workingPercentage = getWorkingPercentage(item);
    const efficiencyColor = workingPercentage >= 80 ? '#10b981' : 
                           workingPercentage >= 50 ? '#f59e0b' : '#ef4444';
    
    return (
      <TouchableOpacity
        style={styles.districtCard}
        onPress={() => handleDistrictPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.districtCardHeader}>
          <View style={styles.districtTitleContainer}>
            <View style={[styles.districtIcon, { backgroundColor: regionColor + '20' }]}>
              <MaterialIcons name="location-on" size={20} color={regionColor} />
            </View>
            <View style={styles.districtTitle}>
              <Typography variant="h3" style={styles.districtName}>
                {item.name}
              </Typography>
              {item.description && (
                <Typography variant="caption" style={styles.districtDescription}>
                  {item.description}
                </Typography>
              )}
            </View>
          </View>

          <View style={[styles.districtRiskBadge, { backgroundColor: getRiskLevelColor(item.riskLevel) + '15' }]}>
            <MaterialIcons name={getRiskLevelIcon(item.riskLevel) as any} size={14} color={getRiskLevelColor(item.riskLevel)} />
            <Typography variant="caption" style={[styles.districtRiskText, { color: getRiskLevelColor(item.riskLevel) }]}>
              {item.riskLevel.toUpperCase()}
            </Typography>
          </View>
        </View>

        {/* <View style={styles.districtDetails}>
          <View style={styles.districtDetailItem}>
            <MaterialIcons name="people" size={14} color="#64748b" />
            <Typography variant="caption" style={styles.districtDetailText}>
              {item.population}
            </Typography>
          </View>
          <View style={styles.districtDetailItem}>
            <MaterialIcons name="square-foot" size={14} color="#64748b" />
            <Typography variant="caption" style={styles.districtDetailText}>
              {item.area}
            </Typography>
          </View>
          <View style={styles.districtDetailItem}>
            <MaterialIcons name="water" size={14} color="#64748b" />
            <Typography variant="caption" style={styles.districtDetailText}>
              {item.waterSources} Sources
            </Typography>
          </View>
        </View> */}

        <View style={styles.districtStats}>
          <View style={styles.districtStatItem}>
            <Typography variant="h1" style={[styles.districtCount, { color: regionColor }]}>
              {item.waterSources}
            </Typography>
            <Typography variant="caption" style={styles.districtStatLabel}>
              Total
            </Typography>
          </View>

          <View style={styles.districtStatDivider} />

          <View style={styles.districtStatItem}>
            <Typography variant="h1" style={[styles.districtCount, { color: efficiencyColor }]}>
              {item.workingSources}
            </Typography>
            <Typography variant="caption" style={styles.districtStatLabel}>
              Working
            </Typography>
          </View>

          {/* <View style={styles.districtStatDivider} /> */}

          {/* <View style={styles.districtStatItem}>
            <Typography variant="h1" style={[styles.districtCount, { color: regionColor }]}>
              {workingPercentage}%
            </Typography>
            <Typography variant="caption" style={styles.districtStatLabel}>
              Efficiency
            </Typography>
          </View> */}
        </View>

        {/* <View style={styles.districtProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${workingPercentage}%`,
                  backgroundColor: regionColor
                }
              ]}
            />
          </View>
          <View style={styles.progressLabel}>
            <MaterialIcons name="check-circle" size={12} color="#10b981" />
            <Typography variant="caption" style={styles.progressText}>
              {item.workingSources} of {item.waterSources} sources working
            </Typography>
            <Typography variant="caption" style={[styles.progressPercentage, { color: efficiencyColor }]}>
              {workingPercentage}%
            </Typography>
          </View>
        </View> */}

        <View style={styles.viewDetailsButton}>
          <Typography variant="caption" style={[styles.viewDetailsText, { color: regionColor }]}>
            View Water Sources
          </Typography>
          <MaterialIcons name="arrow-forward" size={16} color={regionColor} />
        </View>
      </TouchableOpacity>
    );
  };

  const regionWorkingPercentage = regionData 
    ? Math.round((regionData.workingSources / regionData.totalSources) * 100)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={[regionColor, regionColor + 'CC']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Typography style={styles.headerSubtitle}>Districts in</Typography>
            <Typography style={styles.headerTitle}>{regionName}</Typography>
          </View>
          
          <View style={styles.placeholder} />
        </View>

        {/* Region Stats */}
        <View style={styles.regionStats}>
          <View style={styles.regionStatItem}>
            <MaterialIcons name="location-city" size={20} color="white" />
            <Typography style={styles.regionStatValue}>
              {regionData?.totalDistricts || 0}
            </Typography>
            <Typography style={styles.regionStatLabel}>Districts</Typography>
          </View>
          <View style={styles.regionStatItem}>
            <MaterialIcons name="water" size={20} color="white" />
            <Typography style={styles.regionStatValue}>
              {regionData?.totalSources || 0}
            </Typography>
            <Typography style={styles.regionStatLabel}>Sources</Typography>
          </View>
          <View style={styles.regionStatItem}>
            <MaterialIcons name="trending-up" size={20} color="white" />
            <Typography style={styles.regionStatValue}>
              {regionWorkingPercentage}%
            </Typography>
            <Typography style={styles.regionStatLabel}>Working</Typography>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search districts..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Typography variant="body" style={[styles.filterTabText, activeFilter === 'all' && styles.filterTabTextActive]}>
              All
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'high' && styles.filterTabActive]}
            onPress={() => setActiveFilter('high')}
          >
            <MaterialIcons name="warning" size={16} color={activeFilter === 'high' ? '#ef4444' : '#64748b'} />
            <Typography variant="body" style={[styles.filterTabText, activeFilter === 'high' && styles.filterTabTextActive]}>
              High Risk
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'medium' && styles.filterTabActive]}
            onPress={() => setActiveFilter('medium')}
          >
            <MaterialIcons name="info" size={16} color={activeFilter === 'medium' ? '#f59e0b' : '#64748b'} />
            <Typography variant="body" style={[styles.filterTabText, activeFilter === 'medium' && styles.filterTabTextActive]}>
              Medium
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'low' && styles.filterTabActive]}
            onPress={() => setActiveFilter('low')}
          >
            <MaterialIcons name="check-circle" size={16} color={activeFilter === 'low' ? '#10b981' : '#64748b'} />
            <Typography variant="body" style={[styles.filterTabText, activeFilter === 'low' && styles.filterTabTextActive]}>
              Low Risk
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Districts List */}
      <FlatList
        data={filteredDistricts}
        renderItem={renderDistrictCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.districtsList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.resultsHeader}>
            <Typography variant="body" style={styles.resultsCount}>
              {filteredDistricts.length} districts found
            </Typography>
            {searchQuery.trim() && (
              <Typography variant="caption" style={styles.searchQuery}>
                for "{searchQuery}"
              </Typography>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={48} color="#e2e8f0" />
            <Typography variant="h3" style={styles.emptyTitle}>
              No districts found
            </Typography>
            <Typography variant="body" style={styles.emptyText}>
              {searchQuery.trim()
                ? 'Try a different search term'
                : 'No districts available for this filter'}
            </Typography>
          </View>
        }
      />
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
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 44,
  },
  // Region Stats
  regionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  regionStatItem: {
    alignItems: 'center',
  },
  regionStatValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  regionStatLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  // Filter Section
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  // Districts List
  districtsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  searchQuery: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  // District Card
  districtCard: {
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
  districtCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  districtTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  districtIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  districtTitle: {
    flex: 1,
  },
  districtName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  districtDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  districtRiskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  districtRiskText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // District Details
  districtDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  districtDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  districtDetailText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  // District Stats
  districtStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  districtStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  districtCount: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  districtStatLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  districtStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
  },
  // District Progress
  districtProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '700',
  },
  // View Details Button
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
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
  },
});

export default DistrictDetailsScreen;