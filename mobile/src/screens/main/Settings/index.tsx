import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, language } = useTranslation();

  const settingsItems = [
    {
      icon: 'language',
      title: t('language'),
      subtitle: `${t(language === 'en' ? 'english' : 'somali')} ${t('tapToChange')}`,
      onPress: () => navigation.navigate('LanguageSelect' as never),
      gradient: ['#667eea', '#764ba2'],
    },
    {
      icon: 'info',
      title: t('about'),
      subtitle: t('aboutSubtitle'),
      onPress: () => navigation.navigate('About' as never),
      gradient: ['#f093fb', '#f5576c'],
    },
  ];

  return (
    <Layout style={styles.container} noPadding>
      {/* Premium Compact Header */}
      <View style={styles.headerContainer}>
        <LinearGradient 
          colors={['#0c6dff', '#4f46e5']} 
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Header Content */}
          <View style={styles.headerContent}>
            {/* Top Row with Icons */}
            <View style={styles.headerTopRow}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={22} color="white" />
              </TouchableOpacity>
              
              <View style={styles.centerTitle}>
                <View style={styles.titleIcon}>
                  <Ionicons name="settings-sharp" size={20} color="white" />
                </View>
                <Typography variant="h1" style={styles.headerTitle}>
                  {t('settings')}
                </Typography>
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>
            
            {/* Subtitle */}
            <View style={styles.headerSubtitleRow}>
              <Feather name="info" size={14} color="rgba(255,255,255,0.8)" />
              <Typography variant="body" style={styles.headerSubtitle}>
                {t('settingsSubtitle')}
              </Typography>
            </View>
          </View>
          
          {/* Bottom Curve */}
          <View style={styles.headerBottom}>
            <View style={styles.curveLine} />
            <View style={styles.curveShape} />
          </View>
        </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Cards */}
        <View style={styles.settingsContainer}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.settingCard}
              onPress={item.onPress}
              activeOpacity={0.85}
            >
              <LinearGradient 
                colors={item.gradient as any} 
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {/* Card Content */}
                <View style={styles.cardContent}>
                  {/* Icon Container */}
                  <View style={styles.cardIconContainer}>
                    <View style={styles.iconBackground}>
                      <MaterialIcons name={item.icon as any} size={22} color="white" />
                    </View>
                  </View>
                  
                  {/* Text Content */}
                  <View style={styles.cardTextContainer}>
                    <Typography variant="h3" style={styles.cardTitle}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" style={styles.cardSubtitle}>
                      {item.subtitle}
                    </Typography>
                  </View>
                  
                  {/* Arrow Icon */}
                  <View style={styles.cardArrow}>
                    <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.9)" />
                  </View>
                </View>
                
                {/* Card Decoration */}
                <View style={styles.cardDecoration} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerBackground: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  centerTitle: {
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 8,
    lineHeight: 20,
  },
  headerBottom: {
    position: 'relative',
    height: 20,
  },
  curveLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  curveShape: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  // Content Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  settingCard: {
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 18,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  cardIconContainer: {
    marginRight: 16,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    lineHeight: 18,
  },
  cardArrow: {
    marginLeft: 8,
  },
  cardDecoration: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SettingsScreen;