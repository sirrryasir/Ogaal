import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DroughtStatusDashboard from '../screens/main/Home/index';
import WaterSourcesMap from '../screens/main/WaterSourcesMap/index';
import AlertsEarlyWarnings from '../screens/main/AlertsEarlyWarnings/index';
import ActionsGuidance from '../screens/main/ActionsGuidance/index';
import ReportConditions from '../screens/main/ReportConditions/index';
import CommunityAreaSummary from '../screens/main/CommunityAreaSummary/index';
import BrandColors from '../theme';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'WaterSources') {
            iconName = 'water';
          } else if (route.name === 'Alerts') {
            iconName = 'notifications';
          } else if (route.name === 'Actions') {
            iconName = 'bulb';
          } else if (route.name === 'Report') {
            iconName = 'create';
          } else if (route.name === 'Summary') {
            iconName = 'stats-chart';
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
        name="Dashboard"
        component={DroughtStatusDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="WaterSources"
        component={WaterSourcesMap}
        options={{ title: 'Water Sources' }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsEarlyWarnings}
        options={{ title: 'Alerts' }}
      />
      <Tab.Screen
        name="Actions"
        component={ActionsGuidance}
        options={{ title: 'Actions' }}
      />
      <Tab.Screen
        name="Report"
        component={ReportConditions}
        options={{ title: 'Report' }}
      />
      <Tab.Screen
        name="Summary"
        component={CommunityAreaSummary}
        options={{ title: 'Summary' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;