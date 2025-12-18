import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const features = [
    { icon: 'location', text: t('feature1'), color: '#0c6dff' },
    { icon: 'map', text: t('feature2'), color: '#8b5cf6' },
    { icon: 'people', text: t('feature3'), color: '#10b981' },
    { icon: 'document-text', text: t('feature4'), color: '#f59e0b' },
  ];

  const socialLinks = [
    { icon: 'globe-outline', label: 'Website', color: '#0c6dff', url: 'https://ogaal.ai' },
    { icon: 'mail-outline', label: 'Email', color: '#ef4444', url: 'mailto:salmanabdikadir01@gmail.com' },
    { icon: 'call-outline', label: 'Phone', color: '#10b981', url: 'tel:+252636819294' },
  ];

  const handleSocialPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <Layout style={styles.container} noPadding>
      {/* Header */}
      <LinearGradient 
        colors={['#0c6dff', '#4f46e5']} 
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={22} color="white" />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <View style={styles.titleIcon}>
                <Ionicons name="information-circle" size={20} color="white" />
              </View>
              <Typography variant="h1" style={styles.headerTitle}>
                {t('aboutTitle')}
              </Typography>
            </View>
            
            <View style={styles.rightPlaceholder} />
          </View>
        </View>
        
        {/* Header Curve */}
        <View style={styles.headerCurve} />
      </LinearGradient>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo Section */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#0c6dff', '#4f46e5']}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <FontAwesome5 name="water" size={40} color="white" />
              </View>
              <Typography variant="h1" style={styles.appName}>
                OGAAL AI
              </Typography>
              <Typography variant="caption" style={styles.version}>
                {t('version')} 1.0.0
              </Typography>
            </View>
          </LinearGradient>
        </View>

        {/* Description Card */}
        <View style={styles.descriptionSection}>
          <Typography variant="h2" style={styles.sectionTitle}>
            About Our Mission
          </Typography>
          <View style={styles.descriptionCard}>
            <Typography variant="body" style={styles.description}>
              {t('description')}
            </Typography>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Typography variant="h2" style={styles.sectionTitle}>
            {t('features')}
          </Typography>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <LinearGradient
                  colors={[feature.color + '20', feature.color + '10']}
                  style={styles.featureGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={[styles.featureIconContainer, { backgroundColor: feature.color + '15' }]}>
                    <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                  </View>
                  <Typography variant="body" style={styles.featureText}>
                    {feature.text}
                  </Typography>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Typography variant="h2" style={styles.sectionTitle}>
            {t('contact')}
          </Typography>
          
          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="mail" size={24} color="#0c6dff" />
              </View>
              <View style={styles.contactInfo}>
                <Typography variant="h3" style={styles.contactTitle}>
                  {t('contact')}
                </Typography>
                <Typography variant="caption" style={styles.contactSubtitle}>
                  {t('contactText')}
                </Typography>
              </View>
            </View>
            
            <View style={styles.socialLinks}>
              {socialLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.socialButton}
                  onPress={() => handleSocialPress(link.url)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.socialIcon, { backgroundColor: link.color + '15' }]}>
                    <Ionicons name={link.icon as any} size={20} color={link.color} />
                  </View>
                  <Typography variant="caption" style={styles.socialLabel}>
                    {link.label}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.developerSection}>
          <Typography variant="h2" style={styles.sectionTitle}>
            About the Developer
          </Typography>
          <View style={styles.developerCard}>
            <Typography variant="body" style={styles.developerText}>
              This app was developed by Salman Abdikadir, dedicated to improving water resource management in Somaliland through innovative technology solutions.
            </Typography>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Typography variant="caption" style={styles.footerText}>
            © {new Date().getFullYear()} OGAAL AI. All rights reserved.
          </Typography>
          <Typography variant="caption" style={styles.footerSubtext}>
            Made with ❤️ for Somaliland
          </Typography>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header Styles
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
  },
  rightPlaceholder: {
    width: 40,
  },
  headerCurve: {
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
  // Logo Section
  logoSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  logoGradient: {
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 1,
  },
  version: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // Sections
  descriptionSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  developerSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  developerCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  developerText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#334155',
    textAlign: 'center',
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  // Description Card
  descriptionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#334155',
    textAlign: 'center',
    fontWeight: '400',
  },
  // Features
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
  },
  featureGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Contact
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(12, 109, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(12, 109, 255, 0.2)',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  socialLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#cbd5e1',
    fontStyle: 'italic',
  },
});

export default AboutScreen;