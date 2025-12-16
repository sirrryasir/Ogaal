import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
const BrandColors = require('../../../theme');
import { useTranslation } from '../../../contexts/LanguageContext';

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const features = [
    { icon: 'location-on', text: t('feature1') },
    { icon: 'map', text: t('feature2') },
    { icon: 'people', text: t('feature3') },
    { icon: 'report', text: t('feature4') },
  ];

  return (
    <Layout>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarLeft} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={BrandColors.brand.blue} />
        </TouchableOpacity>
        <Typography variant="h1" style={styles.topBarTitle}>{t('aboutTitle')}</Typography>
        <View style={styles.topBarRight} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <LinearGradient colors={['#f0f7ff', '#ffffff']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="water" size={80} color="white" />
            </View>
            <Typography variant="h1" style={styles.appName}>{t('appName')}</Typography>
            <Typography variant="body" style={styles.version}>{t('version')}</Typography>
          </View>
        </LinearGradient>

        <View style={styles.descriptionCard}>
          <Typography variant="body" style={styles.description}>
            {t('description')}
          </Typography>
        </View>

        <View style={styles.featuresSection}>
          <Typography variant="h2" style={styles.sectionTitle}>{t('features')}</Typography>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialIcons name={feature.icon as any} size={24} color={BrandColors.brand.blue} />
              </View>
              <Typography variant="body" style={styles.featureText}>
                {feature.text}
              </Typography>
            </View>
          ))}
        </View>

        <View style={styles.contactSection}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.contactGradient}>
            <Ionicons name="mail" size={30} color="white" style={styles.contactIcon} />
            <Typography variant="h2" style={styles.contactTitle}>{t('contact')}</Typography>
            <Typography variant="body" style={styles.contactText}>
              {t('contactText')}
            </Typography>
          </LinearGradient>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: BrandColors.app.bodyBackground,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.ui.border,
  },
  topBarLeft: {
    width: 40,
    alignItems: 'center',
  },
  topBarTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    textAlign: 'center',
  },
  topBarRight: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerGradient: {
    borderRadius: 0,
    paddingVertical: 40,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: BrandColors.brand.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  descriptionCard: {
    backgroundColor: BrandColors.ui.card,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    color: BrandColors.ui.foreground,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.ui.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BrandColors.ui.border,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    flex: 1,
    color: BrandColors.ui.foreground,
    lineHeight: 20,
  },
  contactSection: {
    paddingHorizontal: 20,
  },
  contactGradient: {
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  contactIcon: {
    marginBottom: 10,
  },
  contactTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactText: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AboutScreen;