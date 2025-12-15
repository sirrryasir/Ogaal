import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
const BrandColors = require('../../../theme');
import { useTranslation } from '../../../contexts/LanguageContext';

const ReportConditionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [waterSourceType, setWaterSourceType] = useState('Borehole');
  const [villageLocation, setVillageLocation] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationText, setLocationText] = useState('Fetching location...');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Location permission denied');
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
        setLocationText('Unable to fetch location');
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);


  const handleSubmit = async () => {
    if (!reportDetail.trim()) {
      Alert.alert(t('errorTitle'), t('errorMessage'));
      return;
    }

    setSubmitting(true);
    // Simulate submit
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    Alert.alert(t('successTitle'), t('successMessage'));
    // Reset form
    setWaterSourceType('Borehole');
    setVillageLocation('');
    setReportDetail('');
    setLocation(null);
    setLocationText('Fetching location...');
    setLoadingLocation(true);
    setPhotoUri(null);
    setSubmitting(false);
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

  return (
    <Layout noPadding>
      <View style={styles.topBar}>
        <Typography variant="h1" style={styles.topBarTitle}>{t('reportConditionsTitle')}</Typography>
        <TouchableOpacity style={styles.topBarRight} onPress={() => navigation.navigate('Notifications' as never)}>
          <MaterialIcons name="notifications" size={24} color={BrandColors.brand.blue} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>

        <View style={styles.descriptionCard}>
          <Ionicons name="information-circle" size={20} color={BrandColors.brand.blue} style={styles.descriptionIcon} />
          <Typography variant="body" style={styles.description}>
            Help improve drought monitoring by reporting conditions in your area.
            Your reports contribute to better decision-making and support for affected communities.
          </Typography>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <Ionicons name="water" size={20} color={BrandColors.ui.primary} />
            <Typography variant="h3" style={styles.sectionTitle}>{t('waterSourceInfo')}</Typography>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="water" size={16} color={BrandColors.ui.primary} />
              <Typography variant="body" style={styles.label}>{t('waterSourceType')}</Typography>
            </View>
            <Picker
              selectedValue={waterSourceType}
              onValueChange={(itemValue: string) => setWaterSourceType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Borehole" value="Borehole" />
              <Picker.Item label="Well" value="Well" />
              <Picker.Item label="Berkad" value="Berkad" />
              <Picker.Item label="Dam" value="Dam" />
            </Picker>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="location" size={16} color={BrandColors.ui.primary} />
              <Typography variant="body" style={styles.label}>{t('villageLocation')}</Typography>
            </View>
            <Input
              placeholder="Enter village or location name"
              value={villageLocation}
              onChangeText={setVillageLocation}
            />
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="document-text" size={16} color={BrandColors.ui.primary} />
              <Typography variant="body" style={styles.label}>{t('reportDetail')}</Typography>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe the water source condition (e.g., borehole is dry, well has low water)"
                value={reportDetail}
                onChangeText={setReportDetail}
                multiline
                numberOfLines={4}
                placeholderTextColor={BrandColors.ui.mutedForeground}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="location" size={16} color={BrandColors.ui.primary} />
              <Typography variant="body" style={styles.label}>{t('location')}</Typography>
            </View>
            <Typography variant="body" style={styles.locationText}>
              {locationText}
            </Typography>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="camera" size={16} color={BrandColors.ui.secondary} />
              <Typography variant="body" style={styles.label}>{t('photoOptional')}</Typography>
            </View>
            {photoUri ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photoUri }} style={styles.photoImage} />
                <TouchableOpacity style={styles.removePhotoButton} onPress={() => setPhotoUri(null)}>
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title={uploading ? t('uploading') : t('attachPhoto')}
                onPress={handleAttachPhoto}
                variant="secondary"
                style={styles.photoButton}
                disabled={uploading}
              />
            )}
          </View>

          <LinearGradient colors={['#007bff', '#0056b3']} style={styles.submitGradient}>
            <TouchableOpacity style={styles.submitTouchable} onPress={handleSubmit} disabled={submitting}>
              <Ionicons name={submitting ? "hourglass" : "send"} size={20} color="white" style={styles.submitIcon} />
              <Typography variant="body" style={styles.submitText}>
                {submitting ? t('submitting') : t('submitReport')}
              </Typography>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
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
    backgroundColor: BrandColors.app.bodyBackground,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.ui.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
  },
  topBarRight: {
    width: 40,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 15,
    paddingBottom: 30,
    backgroundColor: BrandColors.app.bodyBackground,
  },
  description: {
    flex: 1,
    lineHeight: 20,
  },
  form: {
    flex: 1,
    backgroundColor: BrandColors.ui.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    marginLeft: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedTypeButton: {
    backgroundColor: BrandColors.ui.primary,
    borderColor: BrandColors.ui.primary,
  },
  typeButtonText: {
    color: BrandColors.ui.foreground,
  },
  selectedTypeButtonText: {
    color: BrandColors.ui.primaryForeground,
  },
  inputContainer: {
    marginBottom: 15,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    borderRadius: 8,
    padding: 12,
    color: BrandColors.ui.foreground,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationLabel: {
    marginLeft: 8,
  },
  locationText: {
    backgroundColor: BrandColors.ui.muted,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  photoButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoIcon: {
    marginRight: 10,
  },
  photoButton: {
    flex: 1,
  },
  photoContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  photoImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: BrandColors.ui.foreground,
    backgroundColor: BrandColors.ui.input,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    borderRadius: 8,
    marginBottom: 15,
  },
  descriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.ui.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  descriptionIcon: {
    marginRight: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BrandColors.ui.foreground,
    marginLeft: 10,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  submitGradient: {
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  submitTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitIcon: {
    marginRight: 10,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: BrandColors.ui.border,
    marginVertical: 15,
  },
});

export default ReportConditionsScreen;