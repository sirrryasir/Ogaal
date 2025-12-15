import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DroughtStatusDashboard from '../screens/main/Home/index';
import WaterSourcesMap from '../screens/main/WaterSourcesMap/index';
import ReportConditions from '../screens/main/ReportConditions/index';
import SettingsScreen from '../screens/main/Settings/index';
import BrandColors from '../theme';
import { useTranslation } from '../contexts/LanguageContext';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'WaterSources') {
            iconName = 'water';
          } else if (route.name === 'Report') {
            iconName = 'create';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: BrandColors.ui.primary,
        tabBarInactiveTintColor: BrandColors.ui.mutedForeground,
        tabBarStyle: {
          backgroundColor: BrandColors.ui.card,
          borderTopColor: BrandColors.ui.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={DroughtStatusDashboard}
        options={{ title: t('home') }}
      />
      <Tab.Screen
        name="WaterSources"
        component={WaterSourcesMap}
        options={{ title: t('waterSources') }}
      />
      <Tab.Screen
        name="Report"
        component={ReportConditions}
        options={{ title: t('report') }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings') }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;