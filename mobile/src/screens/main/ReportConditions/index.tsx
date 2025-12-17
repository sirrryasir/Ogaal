import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  TextInput, 
  Image,
  RefreshControl,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';
import { getVillages, Village } from '../../../api/villages';
import { getWaterSources, WaterSource } from '../../../api/waterSources';
import { submitReport } from '../../../api/reports';

const { width } = Dimensions.get('window');

const ReportConditionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState<number | null>(null);
  const [waterSources, setWaterSources] = useState<WaterSource[]>([]);
  const [selectedWaterSourceId, setSelectedWaterSourceId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('Working');
  const [reportDetail, setReportDetail] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationText, setLocationText] = useState('Fetching location...');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Progress steps
  const steps = [
    { icon: 'location-on', title: t('stepLocation'), completed: selectedVillageId !== null },
    { icon: 'water', title: t('stepSource'), completed: selectedWaterSourceId !== null },
    { icon: 'check-circle', title: t('stepStatus'), completed: selectedWaterSourceId !== null },
    { icon: 'description', title: t('stepDetails'), completed: reportDetail.length > 0 },
    { icon: 'camera-alt', title: t('stepPhoto'), completed: !!photoUri },
  ];
  
  const completedSteps = steps.filter(step => step.completed).length;

  // Header animations based on scroll - REDUCED HEIGHTS
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [220, 80],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTitleTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -15],
    extrapolate: 'clamp',
  });

  const stepsContainerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const stepsContainerTranslateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -15],
    extrapolate: 'clamp',
  });

  const collapsedHeaderOpacity = scrollY.interpolate({
    inputRange: [80, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const collapsedHeaderTranslateY = scrollY.interpolate({
    inputRange: [80, 120],
    outputRange: [15, 0],
    extrapolate: 'clamp',
  });

  // Location effect (unchanged)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText(t('locationPermissionDenied'));
        setLoadingLocation(false);
        return;
      }

      try {
        let locationData = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        });
        setLocationText(`${locationData.coords.latitude.toFixed(4)}, ${locationData.coords.longitude.toFixed(4)}`);
      } catch (error) {
        setLocationText(t('unableToFetchLocation'));
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  // Villages effect (unchanged)
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const fetchedVillages = await getVillages();
        setVillages(fetchedVillages);
      } catch (error) {
        console.error('Failed to fetch villages:', error);
        Alert.alert(t('errorTitle'), t('errorMessage'));
      }
    };
    fetchVillages();
  }, [t]);

  // Water sources effect (unchanged)
  useEffect(() => {
    if (selectedVillageId) {
      const fetchWaterSources = async () => {
        try {
          const fetchedWaterSources = await getWaterSources(selectedVillageId);
          setWaterSources(fetchedWaterSources);
        } catch (error) {
          console.error('Failed to fetch water sources:', error);
          Alert.alert(t('errorTitle'), t('errorMessage'));
        }
      };
      fetchWaterSources();
    } else {
      setWaterSources([]);
      setSelectedWaterSourceId(null);
    }
  }, [selectedVillageId, t]);

  // Initial fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Submit handler (unchanged)
  const handleSubmit = async () => {
    if (selectedVillageId === null || selectedWaterSourceId === null || !reportDetail.trim()) {
      Alert.alert(t('errorTitle'), t('errorMessage'));
      return;
    }

    setSubmitting(true);
    try {
      await submitReport({
        village_id: selectedVillageId,
        water_source_id: selectedWaterSourceId,
        reporter_type: 'App',
        report_content: reportDetail,
        status: selectedStatus,
      });
      Alert.alert(t('successTitle'), t('successMessage'));
      // Reset form
      setSelectedVillageId(null);
      setSelectedWaterSourceId(null);
      setSelectedStatus('Working');
      setReportDetail('');
      setPhotoUri(null);
    } catch (error) {
      console.error('Failed to submit report:', error);
      Alert.alert(t('errorTitle'), t('errorMessage'));
    } finally {
      setSubmitting(false);
    }
  };

  // Photo handlers
  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted === false) {
      Alert.alert(t('permissionDenied'), t('cameraPermissionRequired'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      uploadToUploadcare(uri);
    }
  };

  const handleAttachPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) {
      Alert.alert(t('permissionDenied'), t('permissionDenied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      uploadToUploadcare(uri);
    }
  };

  const uploadToUploadcare = async (uri: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('UPLOADCARE_PUB_KEY', 'db5971bb8db82d86a6b6');
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    try {
      const response = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setPhotoUri(`https://ucarecdn.com/${data.file}/`);
      Alert.alert(t('successTitle'), t('uploadSuccess'));
    } catch (error) {
      Alert.alert(t('errorTitle'), t('uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Working': return '#10b981';
      case 'Low Water': return '#f59e0b';
      case 'Dry': return '#ef4444';
      case 'Broken': return '#ef4444';
      case 'Other': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <Layout style={styles.container} noPadding>
      {/* Collapsible Header - REDUCED HEIGHT */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <LinearGradient 
          colors={['#0c6dff', '#4f46e5']} 
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Expanded Header Content - COMPACT */}
          <Animated.View 
            style={[
              styles.expandedContent,
              {
                opacity: headerTitleOpacity,
                transform: [{ translateY: headerTitleTranslateY }]
              }
            ]}
          >
            <View style={styles.headerTopRow}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={20} color="white" />
              </TouchableOpacity>
              
              <View style={styles.titleContainer}>
                <View style={styles.titleIcon}>
                  <Ionicons name="create" size={18} color="white" />
                </View>
                <Typography variant="h1" style={styles.headerTitle}>
                  {t('reportConditionsTitle')}
                </Typography>
              </View>
              
              <View style={styles.progressBadge}>
                <Typography variant="caption" style={styles.progressBadgeText}>
                  {completedSteps}/{steps.length}
                </Typography>
              </View>
            </View>
            
            {/* Progress Steps - COMPACT */}
            <Animated.View 
              style={[
                styles.stepsContainer,
                {
                  opacity: stepsContainerOpacity,
                  transform: [{ translateY: stepsContainerTranslateY }]
                }
              ]}
            >
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(completedSteps / steps.length) * 100}%` }
                  ]} 
                />
              </View>
              
              <View style={styles.stepsRow}>
                {steps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={[
                      styles.stepCircle,
                      step.completed && styles.stepCircleCompleted,
                      { backgroundColor: step.completed ? '#10b981' : 'rgba(255, 255, 255, 0.1)' }
                    ]}>
                      <MaterialIcons 
                        name={step.icon as any} 
                        size={14} 
                        color={step.completed ? 'white' : 'rgba(255, 255, 255, 0.6)'} 
                      />
                    </View>
                    <Typography variant="caption" style={[
                      styles.stepLabel,
                      step.completed && styles.stepLabelCompleted
                    ]}>
                      {step.title}
                    </Typography>
                  </View>
                ))}
              </View>
            </Animated.View>
          </Animated.View>

          {/* Collapsed Header Content - COMPACT */}
          <Animated.View 
            style={[
              styles.collapsedContent,
              {
                opacity: collapsedHeaderOpacity,
                transform: [{ translateY: collapsedHeaderTranslateY }]
              }
            ]}
          >
            <View style={styles.collapsedBar}>
              <TouchableOpacity 
                style={styles.collapsedBackButton}
                onPress={() => navigation.goBack()}
              >
                <Feather name="arrow-left" size={18} color="white" />
              </TouchableOpacity>
              
              <View style={styles.collapsedTitle}>
                <Ionicons name="create" size={18} color="white" />
                <Typography variant="h3" style={styles.collapsedTitleText}>
                  {t('reportConditionsTitle')} {completedSteps > 0 && `(${completedSteps}/${steps.length})`}
                </Typography>
              </View>
              
              <View style={styles.collapsedProgress}>
                <View style={styles.collapsedProgressBar}>
                  <View 
                    style={[
                      styles.collapsedProgressFill, 
                      { width: `${(completedSteps / steps.length) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </Animated.View>
          
          {/* Bottom Curve */}
          <View style={styles.headerCurve} />
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0c6dff"
            colors={['#0c6dff']}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {/* Add spacer for header height - REDUCED */}
        <View style={styles.headerSpacer} />
        
        {/* Welcome Card */}
        <View style={styles.welcomeSection}>
          <LinearGradient
            colors={['#f0f7ff', '#ffffff']}
            style={styles.welcomeCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.welcomeContent}>
              <View style={styles.welcomeIcon}>
                <Ionicons name="water" size={28} color="#0c6dff" />
              </View>
              <Typography variant="h3" style={styles.welcomeTitle}>
                {t('helpCommunity')}
              </Typography>
              <Typography variant="body" style={styles.welcomeText}>
                {t('helpCommunityText')}
              </Typography>
            </View>
          </LinearGradient>
        </View>

        {/* Form Sections */}
        <View style={styles.formSection}>
          {/* Village Selection */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="location" size={18} color="#0c6dff" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Typography variant="h3" style={styles.cardTitle}>
                  {t('selectVillage')}
                </Typography>
                <Typography variant="caption" style={styles.cardSubtitle}>
                  {t('chooseLocation')}
                </Typography>
              </View>
            </View>
            
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedVillageId}
                onValueChange={(itemValue: number | null) => setSelectedVillageId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item
                  label={t('selectVillagePlaceholder')}
                  value={null}
                  color="#94a3b8"
                />
                {villages.map((village) => (
                  <Picker.Item 
                    key={village.id} 
                    label={village.name} 
                    value={village.id} 
                    color="#0f172a"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Water Source Selection */}
          {selectedVillageId && (
            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Ionicons name="water" size={18} color="#0c6dff" />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Typography variant="h3" style={styles.cardTitle}>
                    {t('waterSource')}
                  </Typography>
                  <Typography variant="caption" style={styles.cardSubtitle}>
                    {t('selectFromAvailable')}
                  </Typography>
                </View>
              </View>
              
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedWaterSourceId}
                  onValueChange={(itemValue: number | null) => setSelectedWaterSourceId(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item
                    label={t('selectWaterSourcePlaceholder')}
                    value={null}
                    color="#94a3b8"
                  />
                  {waterSources.map((source) => (
                    <Picker.Item 
                      key={source.id} 
                      label={`${source.name} (${source.type})`} 
                      value={source.id} 
                      color="#0f172a"
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* Status Selection */}
          {selectedWaterSourceId && (
            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Ionicons name="checkmark-circle" size={18} color={getStatusColor(selectedStatus)} />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Typography variant="h3" style={styles.cardTitle}>
                    {t('currentStatus')}
                  </Typography>
                  <Typography variant="caption" style={styles.cardSubtitle}>
                    {t('currentCondition')}
                  </Typography>
                </View>
              </View>
              
              <View style={styles.statusOptions}>
                {['Working', 'Low Water', 'Dry', 'Broken', 'Other'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      selectedStatus === status && [
                        styles.statusButtonSelected,
                        { backgroundColor: getStatusColor(status) + '20', borderColor: getStatusColor(status) }
                      ]
                    ]}
                    onPress={() => setSelectedStatus(status)}
                  >
                    <View style={[
                      styles.statusIcon,
                      { backgroundColor: selectedStatus === status ? getStatusColor(status) : 'transparent' }
                    ]}>
                      <Feather 
                        name="check" 
                        size={14} 
                        color={selectedStatus === status ? 'white' : 'transparent'} 
                      />
                    </View>
                    <Typography variant="body" style={[
                      styles.statusText,
                      { color: selectedStatus === status ? getStatusColor(status) : '#64748b' }
                    ]}>
                      {status === 'Working' ? t('working') :
                       status === 'Low Water' ? t('waterLevelLow') :
                       status === 'Dry' ? t('dry') :
                       status === 'Broken' ? t('pumpBroken') :
                       status === 'Other' ? t('otherIssue') : status}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Report Details */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="document-text" size={18} color="#0c6dff" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Typography variant="h3" style={styles.cardTitle}>
                  {t('reportDetails')}
                </Typography>
                <Typography variant="caption" style={styles.cardSubtitle}>
                  {t('describeObserved')}
                </Typography>
              </View>
            </View>
            
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder={t('reportPlaceholder')}
                placeholderTextColor="#94a3b8"
                value={reportDetail}
                onChangeText={setReportDetail}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <View style={styles.charCount}>
                <Typography variant="caption" style={styles.charCountText}>
                  {reportDetail.length}/500
                </Typography>
              </View>
            </View>
          </View>

          {/* Location Display */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="navigate" size={18} color="#0c6dff" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Typography variant="h3" style={styles.cardTitle}>
                  {t('gpsLocation')}
                </Typography>
                <Typography variant="caption" style={styles.cardSubtitle}>
                  {t('autoDetected')}
                </Typography>
              </View>
            </View>
            
            <View style={styles.locationCard}>
              <View style={styles.locationContent}>
                <Ionicons 
                  name={loadingLocation ? "refresh" : "location"} 
                  size={18} 
                  color="#0c6dff" 
                />
                <View style={styles.locationTextContainer}>
                  <Typography variant="body" style={styles.locationText}>
                    {locationText}
                  </Typography>
                  {location && (
                    <Typography variant="caption" style={styles.locationAccuracy}>
                      {t('accuracy')}
                    </Typography>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Photo Upload */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="camera" size={18} color="#0c6dff" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Typography variant="h3" style={styles.cardTitle}>
                  {t('addPhotoOptional')}
                </Typography>
                <Typography variant="caption" style={styles.cardSubtitle}>
                  {t('uploadPhotoEvidence')}
                </Typography>
              </View>
            </View>
            
            {photoUri ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photoUri }} style={styles.photoImage} />
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => setPhotoUri(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoOptionsContainer}>
                <TouchableOpacity
                  style={styles.photoOptionButton}
                  onPress={handleTakePhoto}
                  disabled={uploading}
                >
                  <LinearGradient
                    colors={['#f093fb', '#f5576c']}
                    style={styles.photoOptionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {uploading ? (
                      <Feather name="loader" size={24} color="white" style={styles.uploadingIcon} />
                    ) : (
                      <>
                        <Ionicons name="camera" size={28} color="white" />
                        <Typography variant="body" style={styles.photoOptionText}>
                          {t('takePhoto')}
                        </Typography>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoOptionButton}
                  onPress={handleAttachPhoto}
                  disabled={uploading}
                >
                  <LinearGradient
                    colors={['#4f46e5', '#7c3aed']}
                    style={styles.photoOptionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {uploading ? (
                      <Feather name="loader" size={24} color="white" style={styles.uploadingIcon} />
                    ) : (
                      <>
                        <Ionicons name="images" size={28} color="white" />
                        <Typography variant="body" style={styles.photoOptionText}>
                          {t('chooseFromGallery')}
                        </Typography>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (submitting || completedSteps < steps.length) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={submitting || completedSteps < steps.length}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={completedSteps === steps.length ? ['#10b981', '#059669'] : ['#0c6dff', '#4f46e5']}
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.submitContent}>
              {submitting ? (
                <Feather name="loader" size={22} color="white" style={styles.submitIcon} />
              ) : (
                <Ionicons 
                  name="send" 
                  size={22} 
                  color="white" 
                  style={styles.submitIcon} 
                />
              )}
              <Typography variant="h3" style={styles.submitText}>
                {submitting ? t('submitting') :
                 completedSteps === steps.length ? t('submitReport') :
                 t('completeMoreSteps').replace('{count}', (steps.length - completedSteps).toString())}
              </Typography>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header Container - REDUCED
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  headerBackground: {
    flex: 1,
  },
  expandedContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 35 : 15, // REDUCED from 50
    paddingBottom: 16, // REDUCED from 24
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, // REDUCED from 24
  },
  backButton: {
    width: 36, // REDUCED from 40
    height: 36, // REDUCED from 40
    borderRadius: 10, // REDUCED from 12
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  titleIcon: {
    width: 30, // REDUCED from 32
    height: 30, // REDUCED from 32
    borderRadius: 15, // REDUCED from 16
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8, // REDUCED from 10
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 20, // REDUCED from 24
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
  },
  progressBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 46, // REDUCED from 50
    height: 26, // REDUCED from 28
    borderRadius: 13, // REDUCED from 14
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBadgeText: {
    color: 'white',
    fontSize: 11, // REDUCED from 12
    fontWeight: '700',
  },
  stepsContainer: {
    marginTop: 4, // REDUCED from 8
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 12, // REDUCED from 16
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32, // REDUCED from 36
    height: 32, // REDUCED from 36
    borderRadius: 16, // REDUCED from 18
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4, // REDUCED from 6
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepCircleCompleted: {
    borderColor: '#10b981',
  },
  stepLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelCompleted: {
    color: 'white',
    fontWeight: '700',
  },
  // Collapsed Header - REDUCED
  collapsedContent: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 35 : 15, // REDUCED from 50/30
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  collapsedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40, // REDUCED from 50
  },
  collapsedBackButton: {
    width: 34, // REDUCED from 36
    height: 34, // REDUCED from 36
    borderRadius: 17, // REDUCED from 18
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // REDUCED from 12
  },
  collapsedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collapsedTitleText: {
    fontSize: 16, // REDUCED from 18
    fontWeight: '700',
    color: 'white',
    marginLeft: 8, // REDUCED from 10
    letterSpacing: -0.3,
  },
  collapsedProgress: {
    width: 50, // REDUCED from 60
  },
  collapsedProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  collapsedProgressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  headerCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSpacer: {
    height: 220, // REDUCED from 300 to match new header height
  },
  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 20, // REDUCED from 24
  },
  welcomeCard: {
    borderRadius: 18, // REDUCED from 20
    padding: 20, // REDUCED from 24
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 56, // REDUCED from 64
    height: 56, // REDUCED from 64
    borderRadius: 28, // REDUCED from 32
    backgroundColor: 'rgba(12, 109, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14, // REDUCED from 16
    borderWidth: 1,
    borderColor: 'rgba(12, 109, 255, 0.2)',
  },
  welcomeTitle: {
    fontSize: 18, // REDUCED from 20
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6, // REDUCED from 8
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Form Section
  formSection: {
    paddingHorizontal: 20,
    gap: 16, // REDUCED from 20
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 18, // REDUCED from 20
    padding: 16, // REDUCED from 20
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // REDUCED from 20
  },
  cardIcon: {
    width: 36, // REDUCED from 40
    height: 36, // REDUCED from 40
    borderRadius: 18, // REDUCED from 20
    backgroundColor: 'rgba(12, 109, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // REDUCED from 12
    borderWidth: 1,
    borderColor: 'rgba(12, 109, 255, 0.2)',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15, // REDUCED from 16
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  // Picker Styles
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10, // REDUCED from 12
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  picker: {
    height: 46, // REDUCED from 50
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  // Status Options
  statusOptions: {
    gap: 8, // REDUCED from 10
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14, // REDUCED from 16
    borderRadius: 10, // REDUCED from 12
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  statusButtonSelected: {
    borderWidth: 2,
  },
  statusIcon: {
    width: 22, // REDUCED from 24
    height: 22, // REDUCED from 24
    borderRadius: 11, // REDUCED from 12
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // REDUCED from 12
    borderWidth: 2,
    borderColor: 'currentColor',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Text Area
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10, // REDUCED from 12
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  textArea: {
    minHeight: 110, // REDUCED from 120
    padding: 14, // REDUCED from 16
    fontSize: 14,
    color: '#0f172a',
    textAlignVertical: 'top',
  },
  charCount: {
    paddingHorizontal: 14, // REDUCED from 16
    paddingVertical: 10, // REDUCED from 12
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    alignItems: 'flex-end',
  },
  charCountText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  // Location Card
  locationCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 10, // REDUCED from 12
    padding: 14, // REDUCED from 16
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 10, // REDUCED from 12
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  locationAccuracy: {
    fontSize: 12,
    color: '#94a3b8',
  },
  // Photo Upload
  photoPreviewContainer: {
    position: 'relative',
    borderRadius: 10, // REDUCED from 12
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: 180, // REDUCED from 200
    borderRadius: 10, // REDUCED from 12
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10, // REDUCED from 12
    right: 10, // REDUCED from 12
    backgroundColor: 'white',
    width: 40, // REDUCED from 44
    height: 40, // REDUCED from 44
    borderRadius: 20, // REDUCED from 22
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  photoOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  photoOptionButton: {
    flex: 1,
    borderRadius: 10, // REDUCED from 12
    overflow: 'hidden',
  },
  photoOptionGradient: {
    padding: 24,
    alignItems: 'center',
  },
  uploadingIcon: {
    marginBottom: 10, // REDUCED from 12
  },
  photoOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  // Submit Button
  submitButton: {
    marginTop: 20, // REDUCED from 24
    marginHorizontal: 20,
    borderRadius: 14, // REDUCED from 16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    padding: 18, // REDUCED from 20
    borderRadius: 14, // REDUCED from 16
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitIcon: {
    marginRight: 10, // REDUCED from 12
  },
  submitText: {
    color: 'white',
    fontSize: 16, // REDUCED from 18
    fontWeight: '700',
  },
});

export default ReportConditionsScreen;