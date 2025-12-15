import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../contexts/LanguageContext';

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
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedWell, setSelectedWell] = useState<WaterSource | null>(null);


  // Mock data with coordinates around Hargeisa, Somaliland
  const [waterSources, setWaterSources] = useState<WaterSource[]>([
    { id: '1', type: 'Borehole', name: 'Borehole A1', status: 'Working', lastUpdate: '2 hours ago', distance: '2.5 km', latitude: 9.5624, longitude: 44.0770 },
    { id: '2', type: 'Well', name: 'Well B2', status: 'Low water', lastUpdate: '1 day ago', distance: '3.1 km', latitude: 9.5650, longitude: 44.0800 },
    { id: '3', type: 'Dam', name: 'Dam C3', status: 'Dry', lastUpdate: '3 days ago', distance: '5.0 km', latitude: 9.5600, longitude: 44.0750 },
    { id: '4', type: 'Berkad', name: 'Berkad D4', status: 'Broken', lastUpdate: '1 week ago', distance: '1.8 km', latitude: 9.5630, longitude: 44.0780 },
  ]);

  const isWeb = Platform.OS === 'web';
  const getMaps = () => {
    if (isWeb) {
      return { MapView: null, Marker: null };
    } else {
      const maps = require('react-native-maps');
      return maps;
    }
  };
  const maps = getMaps();
  const MapViewComp = maps.MapView;
  const MarkerComp = maps.Marker;

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
      case 'Working': return '#28a745'; // Green
      case 'Low water': return '#ffc107'; // Yellow
      case 'Dry': return '#dc3545'; // Red
      case 'Broken': return '#000000'; // Black
      default: return theme.ui.mutedForeground;
    }
  };

  const getFlowCondition = (status: string) => {
    switch (status) {
      case 'Working': return 'Good flow';
      case 'Low water': return 'Reduced flow';
      case 'Dry': return 'No flow';
      case 'Broken': return 'Damaged';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'Borehole': return 'water';
      case 'Well': return 'water';
      case 'Dam': return 'business';
      case 'Berkad': return 'leaf';
      default: return 'water';
    }
  };


  const handleReportStatus = (source: WaterSource) => {
    // Navigate to report screen with source data
    Alert.alert(
      t('reportStatusTitle'),
      t('reportStatusMessage').replace('{name}', source.name),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('reportStatus'), onPress: () => navigation.navigate('Report' as never) },
      ]
    );
  };

  const handleGetDirections = async (well: WaterSource) => {
    if (!location) {
      Alert.alert(t('errorTitle'), 'Location not available');
      return;
    }
    const origin = `${location.latitude},${location.longitude}`;
    const destination = `${well.latitude},${well.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;

    try {
      await Linking.openURL(url);
      setSelectedWell(null); // Close modal
    } catch (error) {
      Alert.alert(t('errorTitle'), 'Unable to open maps');
    }
  };

  const handleReportUpdate = (well: WaterSource) => {
    setSelectedWell(null);
    navigation.navigate('Report' as never);
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
      <View style={[styles.topBar, { backgroundColor: theme.app.bodyBackground, borderBottomColor: theme.ui.border }]}>
        <Typography variant="h1" style={[styles.topBarTitle, { color: theme.brand.blue }]}>{t('waterSourcesMapTitle')}</Typography>
        <TouchableOpacity style={styles.topBarRight} onPress={() => navigation.navigate('Notifications' as never)}>
          <MaterialIcons name="notifications" size={24} color={theme.brand.blue} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {isWeb ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h1">Map not available on web</Typography>
            </View>
          ) : (
            <MapViewComp
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {waterSources.map((source) => (
                <MarkerComp
                  key={source.id}
                  coordinate={{ latitude: source.latitude, longitude: source.longitude }}
                  title={source.name}
                  description={`${source.type} - ${source.status}`}
                  pinColor={source.status === 'Broken' ? 'black' : getStatusColor(source.status)}
                  onPress={() => setSelectedWell(source)}
                />
              ))}
            </MapViewComp>
          )}
        </View>

      </View>

      <Modal
        visible={!!selectedWell}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedWell(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedWell(null)}>
          <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderTopColor: selectedWell ? getStatusColor(selectedWell.status) : theme.ui.border, borderTopWidth: 4, backgroundColor: theme.ui.background }]}>
            {selectedWell && (
              <>
                <View style={[styles.statusHeader, { backgroundColor: getStatusColor(selectedWell.status) + '20', borderBottomColor: theme.ui.border }]}>
                  <Ionicons name={getStatusIcon(selectedWell.type)} size={30} color={getStatusColor(selectedWell.status)} />
                  <Typography variant="h2" style={[styles.modalTitle, { color: theme.ui.foreground }]}>{selectedWell.name}</Typography>
                  <Typography variant="body" style={[styles.statusText, { color: getStatusColor(selectedWell.status) }]}>{selectedWell.status}</Typography>
                </View>

                <View style={styles.modalDetails}>
                  <Typography variant="body" style={styles.modalText}>{t('typeLabel')} {selectedWell.type}</Typography>
                  <Typography variant="body" style={styles.modalText}>{t('lastUpdateLabel')} {selectedWell.lastUpdate}</Typography>
                  <Typography variant="body" style={styles.modalText}>{t('flowConditionLabel')} {getFlowCondition(selectedWell.status)}</Typography>
                  <Typography variant="body" style={styles.modalText}>{t('distanceLabel')} {selectedWell.distance}</Typography>
                </View>

                <View style={styles.modalButtons}>
                  <View style={styles.modalButtonCard}>
                    <LinearGradient colors={['#007bff', '#0056b3']} style={styles.buttonGradient}>
                      <TouchableOpacity style={styles.buttonTouchable} onPress={() => handleGetDirections(selectedWell)}>
                        <Ionicons name="navigate" size={24} color="white" />
                        <Typography variant="body" style={styles.buttonText}>{t('getDirections')}</Typography>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  <View style={styles.modalButtonCard}>
                    <LinearGradient colors={['#ff8c00', '#e67e00']} style={styles.buttonGradient}>
                      <TouchableOpacity style={styles.buttonTouchable} onPress={() => handleReportUpdate(selectedWell)}>
                        <Ionicons name="create" size={24} color="white" />
                        <Typography variant="body" style={styles.buttonText}>{t('reportUpdate')}</Typography>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  <View style={styles.modalButtonCard}>
                    <LinearGradient colors={['#6c757d', '#5a6268']} style={styles.buttonGradient}>
                      <TouchableOpacity style={styles.buttonTouchable} onPress={() => setSelectedWell(null)}>
                        <Ionicons name="close" size={24} color="white" />
                        <Typography variant="body" style={styles.buttonText}>{t('close')}</Typography>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  topBarRight: {
    // For future icons
  },
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 2,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 350,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statusHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalDetails: {
    padding: 20,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    padding: 20,
    paddingTop: 0,
  },
  modalButtonCard: {
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },
  buttonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default WaterSourcesMapScreen;