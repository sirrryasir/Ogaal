import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../../../components/Layout';
import Typography from '../../../components/Typography';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../contexts/LanguageContext';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme, themeType, setThemeType } = useTheme();

  return (
    <Layout>
      <View style={[styles.topBar, { backgroundColor: theme.app.bodyBackground, borderBottomColor: theme.ui.border }]}>
        <Typography variant="h1" style={[styles.topBarTitle, { color: theme.brand.blue }]}>Settings</Typography>
        <View style={styles.topBarRight}>
          {/* No notification icon for Settings */}
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Typography variant="h2" style={[styles.sectionTitle, { color: theme.brand.blue }]}>{t('app')}</Typography>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.ui.border }]} onPress={() => navigation.navigate('LanguageSelect' as never)}>
            <MaterialIcons name="language" size={24} color={theme.brand.blue} />
            <Typography variant="body" style={[styles.settingText, { color: theme.ui.foreground }]}>{t('language')}</Typography>
            <MaterialIcons name="chevron-right" size={24} color={theme.ui.secondaryForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.ui.border }]} onPress={() => navigation.navigate('About' as never)}>
            <MaterialIcons name="info" size={24} color={theme.brand.blue} />
            <Typography variant="body" style={[styles.settingText, { color: theme.ui.foreground }]}>{t('about')}</Typography>
            <MaterialIcons name="chevron-right" size={24} color={theme.ui.secondaryForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.ui.border }]} onPress={() => setThemeType(themeType === 'light' ? 'dark' : 'light')}>
            <MaterialIcons name={themeType === 'light' ? 'dark-mode' : 'light-mode'} size={24} color={theme.brand.blue} />
            <Typography variant="body" style={[styles.settingText, { color: theme.ui.foreground }]}>{themeType === 'light' ? 'Dark Mode' : 'Light Mode'}</Typography>
            <MaterialIcons name="toggle-on" size={24} color={theme.ui.secondaryForeground} />
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