import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTranslation } from '../../../contexts/LanguageContext';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Layout>
      <View style={[styles.topBar, { backgroundColor: '#f8fafc', borderBottomColor: '#e2e8f0' }]}>
        <Typography variant="h1" style={[styles.topBarTitle, { color: '#0c6dff' }]}>Settings</Typography>
        <View style={styles.topBarRight}>
          {/* No notification icon for Settings */}
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Typography variant="h2" style={[styles.sectionTitle, { color: '#0c6dff' }]}>{t('app')}</Typography>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: '#e2e8f0' }]} onPress={() => navigation.navigate('LanguageSelect' as never)}>
            <MaterialIcons name="language" size={24} color={'#0c6dff'} />
            <Typography variant="body" style={[styles.settingText, { color: '#0f172a' }]}>{t('language')}</Typography>
            <MaterialIcons name="chevron-right" size={24} color={'#64748b'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: '#e2e8f0' }]} onPress={() => navigation.navigate('About' as never)}>
            <MaterialIcons name="info" size={24} color={'#0c6dff'} />
            <Typography variant="body" style={[styles.settingText, { color: '#0f172a' }]}>{t('about')}</Typography>
            <MaterialIcons name="chevron-right" size={24} color={'#64748b'} />
          </TouchableOpacity>
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
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
  },
});

export default SettingsScreen;