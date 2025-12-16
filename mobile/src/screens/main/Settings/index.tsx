import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';
const BrandColors = require('../../../theme');

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
    <Layout>
      <LinearGradient colors={['#0c6dff', '#0056b3']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Ionicons name="settings" size={28} color="white" />
              <Typography variant="h1" style={styles.headerTitle}>{t('settings')}</Typography>
            </View>
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Ionicons name="settings" size={60} color={BrandColors.brand.blue} style={styles.headerIcon} />
          <Typography variant="h2" style={styles.sectionTitle}>{t('appPreferences')}</Typography>
          <Typography variant="body" style={styles.headerSubtitle}>{t('settingsSubtitle')}</Typography>
        </View>

        <View style={styles.settingsSection}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.settingCard} onPress={item.onPress}>
              <LinearGradient colors={item.gradient as any} style={styles.settingGradient}>
                <View style={styles.settingContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name={item.icon as any} size={28} color="white" />
                  </View>
                  <View style={styles.textContainer}>
                    <Typography variant="h3" style={styles.settingTitle}>{item.title}</Typography>
                    <Typography variant="caption" style={styles.settingSubtitle}>{item.subtitle}</Typography>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    width: '100%',
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  headerIcon: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BrandColors.brand.blue,
    marginBottom: 5,
  },
  headerSubtitle: {
    color: BrandColors.ui.secondaryForeground,
    textAlign: 'center',
  },
  settingsSection: {
    gap: 15,
  },
  settingCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  settingGradient: {
    borderRadius: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
});

export default SettingsScreen;