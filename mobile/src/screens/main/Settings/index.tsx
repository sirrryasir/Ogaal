import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, language } = useTranslation();

  const handleOpenWebPortal = () => {
    const webPortalUrl = 'https://portal.sol-etsgo.com';
    Linking.openURL(webPortalUrl).catch(err => {
      Alert.alert('Error', 'Failed to open web portal. Please check your internet connection.');
    });
  };

  const settingsSections = [
    // {
    //   title: 'Account',
    //   icon: 'user',
    //   color: '#4F46E5',
    //   items: [
    //     {
    //       icon: 'person-outline',
    //       title: 'Profile',
    //       subtitle: 'Manage your personal information',
    //       onPress: () => navigation.navigate('AccountSettings' as never),
    //     },
    //     {
    //       icon: 'shield-checkmark-outline',
    //       title: 'Security',
    //       subtitle: 'Password, 2FA, and privacy settings',
    //       onPress: () => navigation.navigate('PrivacySecurity' as never),
    //     },
    //     {
    //       icon: 'notifications-outline',
    //       title: 'Notifications',
    //       subtitle: 'Customize your notification preferences',
    //       onPress: () => navigation.navigate('NotificationSettings' as never),
    //     },
    //   ],
    // },
    {
      title: 'Preferences',
      icon: 'settings-outline',
      color: '#10B981',
      items: [
        {
          icon: 'language',
          title: 'Language',
          subtitle: language === 'en' ? 'English' : 'Somali',
          onPress: () => navigation.navigate('LanguageSelect' as never),
        },
        {
          icon: 'color-palette-outline',
          title: 'Theme',
          subtitle: 'Dark / Light / Auto',
          onPress: () => Alert.alert('Theme', 'Theme settings coming soon!'),
        },
        {
          icon: 'globe-outline',
          title: 'Web Portal',
          subtitle: 'Access SOL ETSGO online',
          onPress: handleOpenWebPortal,
        },
      ],
    },
    {
      title: 'Support',
      icon: 'help-circle-outline',
      color: '#F59E0B',
      items: [
        {
          icon: 'headset-outline',
          title: 'Help & Support',
          subtitle: 'FAQs, contact us, live chat',
          onPress: () => navigation.navigate('HelpSupport' as never),
        },
        {
          icon: 'information-circle-outline',
          title: 'About',
          subtitle: 'App version and information',
          onPress: () => navigation.navigate('About' as never),
        },
        {
          icon: 'star-outline',
          title: 'Rate App',
          subtitle: 'Share your feedback with us',
          onPress: () => Alert.alert('Rate App', 'Rating feature coming soon!'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Layout style={styles.container} noPadding>
        {/* Header - Modern Glassmorphism */}
        <LinearGradient
          colors={['#0c6dff', '#4f46e5']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Feather name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={styles.titleContainer}>
                <Ionicons name="settings-sharp" size={24} color="#60A5FA" style={styles.titleIcon} />
                <Typography style={styles.headerTitle}>
                  {t('settings')}
                </Typography>
              </View>
              <Typography style={styles.headerSubtitle}>
                Manage your account and preferences
              </Typography>
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Decorative element */}
          <View style={styles.headerDecoration}>
            <View style={styles.decorationCircle} />
            <View style={styles.decorationCircleSmall} />
          </View>
        </LinearGradient>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Profile Card */}
          {/* <View style={styles.profileCard}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.profileGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.profileContent}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={['#FFFFFF', '#F3F4F6']}
                    style={styles.avatar}
                  >
                    <Typography style={styles.avatarText}>JD</Typography>
                  </LinearGradient>
                </View>
                <View style={styles.profileInfo}>
                  <Typography style={styles.profileName}>John Doe</Typography>
                  <Typography style={styles.profileEmail}>john.doe@example.com</Typography>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Feather name="edit-2" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View> */}

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}20` }]}>
                  <Ionicons name={section.icon as any} size={20} color={section.color} />
                </View>
                <Typography style={styles.sectionTitle}>{section.title}</Typography>
              </View>
              
              <View style={styles.sectionCards}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.settingCard}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardContent}>
                      <View style={[styles.itemIcon, { backgroundColor: `${section.color}15` }]}>
                        <Ionicons name={item.icon as any} size={22} color={section.color} />
                      </View>
                      <View style={styles.itemText}>
                        <Typography style={styles.itemTitle}>{item.title}</Typography>
                        <Typography style={styles.itemSubtitle}>{item.subtitle}</Typography>
                      </View>
                      <Feather name="chevron-right" size={20} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Typography style={styles.versionText}>
              OGAAL • v1.0.0 (Build 2025.01)
            </Typography>
            <Typography style={styles.copyrightText}>
              © 2024 OGAAL. All rights reserved.
            </Typography>
          </View>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  decorationCircle: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
  },
  decorationCircleSmall: {
    position: 'absolute',
    top: 50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 24,
    borderRadius: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4F46E5',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionCards: {
    paddingHorizontal: 24,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#CBD5E1',
  },
});

export default SettingsScreen;