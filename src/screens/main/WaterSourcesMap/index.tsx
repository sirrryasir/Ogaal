import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import BrandColors from '../../../theme';

interface WaterSource {
  id: string;
  type: 'Borehole' | 'Well' | 'Berkad' | 'Dam';
  name: string;
  status: 'Working' | 'Low water' | 'Dry' | 'Broken';
  lastUpdate: string;
  distance?: string;
  latitude: number;
  longitude: number;
}

const WaterSourcesMapScreen: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mock data with coordinates around Hargeisa, Somaliland
  const waterSources: WaterSource[] = [
    { id: '1', type: 'Borehole', name: 'Borehole A1', status: 'Working', lastUpdate: '2 hours ago', distance: '2.5 km', latitude: 9.5624, longitude: 44.0770 },
    { id: '2', type: 'Well', name: 'Well B2', status: 'Low water', lastUpdate: '1 day ago', distance: '3.1 km', latitude: 9.5650, longitude: 44.0800 },
    { id: '3', type: 'Dam', name: 'Dam C3', status: 'Dry', lastUpdate: '3 days ago', distance: '5.0 km', latitude: 9.5600, longitude: 44.0750 },
    { id: '4', type: 'Berkad', name: 'Berkad D4', status: 'Broken', lastUpdate: '1 week ago', distance: '1.8 km', latitude: 9.5630, longitude: 44.0780 },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Working': return BrandColors.brand.success;
      case 'Low water': return BrandColors.brand.warning;
      case 'Dry': return '#ff8c00';
      case 'Broken': return BrandColors.brand.danger;
      default: return BrandColors.ui.mutedForeground;
    }
  };

  const handleReportStatus = (source: WaterSource) => {
    // Navigate to report screen with source data
    console.log('Report status for', source.name);
  };

  const handleNavigateToNearest = () => {
    // Navigate to nearest working source
    console.log('Navigate to nearest working source');
  };

  const initialRegion = location ? {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: 9.5624,
    longitude: 44.0770,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <Layout noPadding>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {waterSources.map((source) => (
              <Marker
                key={source.id}
                coordinate={{ latitude: source.latitude, longitude: source.longitude }}
                title={source.name}
                description={`${source.type} - ${source.status}`}
                pinColor={getStatusColor(source.status)}
              />
            ))}
          </MapView>
        </View>

        <View style={styles.bottomContainer}>
          <Typography variant="h1" style={styles.title}>Water Sources Map</Typography>

          <View style={styles.navigateButtonContainer}>
            <Ionicons name="navigate" size={20} color={BrandColors.ui.primaryForeground} style={styles.navigateIcon} />
            <Button
              title="Navigate to nearest working source"
              onPress={handleNavigateToNearest}
              style={styles.navigateButton}
            />
          </View>

          <Typography variant="h2" style={styles.sectionTitle}>Nearby Water Sources</Typography>

          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {waterSources.map((source) => (
              <TouchableOpacity key={source.id} style={styles.sourceCard}>
                <View style={styles.sourceHeader}>
                  <Typography variant="h3">{source.name}</Typography>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(source.status) }]}>
                    <Typography variant="caption" color="primaryForeground">{source.status}</Typography>
                  </View>
                </View>
                <Typography variant="body">Type: {source.type}</Typography>
                <Typography variant="body">Distance: {source.distance}</Typography>
                <Typography variant="caption">Last update: {source.lastUpdate}</Typography>
                <View style={styles.reportButtonContainer}>
                  <Ionicons name="create" size={16} color={BrandColors.ui.secondaryForeground} style={styles.reportIcon} />
                  <Button
                    title="Report status"
                    onPress={() => handleReportStatus(source)}
                    variant="secondary"
                    size="small"
                    style={styles.reportButton}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 15,
    textAlign: 'center',
  },
  navigateButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  navigateIcon: {
    marginRight: 10,
  },
  navigateButton: {
    flex: 1,
  },
  mapContainer: {
    flex: 2,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BrandColors.ui.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  listContainer: {
    flex: 1,
  },
  sourceCard: {
    backgroundColor: BrandColors.ui.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reportButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  reportIcon: {
    marginRight: 6,
  },
  reportButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default WaterSourcesMapScreen;