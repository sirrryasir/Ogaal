import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DroughtStatusDashboard from '../screens/main/Home/index';
import WaterSourcesMap from '../screens/main/WaterSourcesMap/index';
import RegionsScreen from '../screens/main/Regions/index';
import ReportConditions from '../screens/main/ReportConditions/index';
import NotificationsScreen from '../screens/main/Notifications/index';
import SettingsScreen from '../screens/main/Settings/index';
import { useTranslation } from '../contexts/LanguageContext';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const AnimatedTabButton = ({ children, onPress, focused }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 150,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 3,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { t } = useTranslation();
  const translateX = useRef(new Animated.Value(0)).current;
  const TAB_WIDTH = width / state.routes.length;

  useEffect(() => {
    const currentTab = state.index;
    Animated.spring(translateX, {
      toValue: currentTab * TAB_WIDTH,
      useNativeDriver: true,
      tension: 150,
      friction: 20,
    }).start();
  }, [state.index, TAB_WIDTH]);

  return (
    <View style={styles.tabBarContainer}>
      {/* Floating indicator */}
      <Animated.View 
        style={[
          styles.floatingIndicator, 
          { 
            transform: [{ translateX }],
            width: TAB_WIDTH - 20
          }
        ]} 
      />
      
      {/* Tabs */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIconName = () => {
          switch (route.name) {
            case 'Home':
              return isFocused ? 'home' : 'home-outline';
            case 'WaterSources':
              return isFocused ? 'water' : 'water-outline';
            case 'Regions':
              return isFocused ? 'map' : 'map-outline';
            case 'Report':
              return isFocused ? 'create' : 'create-outline';
            case 'Notifications':
              return isFocused ? 'notifications' : 'notifications-outline';
            case 'Settings':
              return isFocused ? 'settings' : 'settings-outline';
            default:
              return 'home-outline';
          }
        };

        const getTitle = () => {
          switch (route.name) {
            case 'Home':
              return t('home');
            case 'WaterSources':
              return t('waterSources');
            case 'Regions':
              return 'Regions';
            case 'Report':
              return t('report');
            case 'Notifications':
              return t('notifications');
            case 'Settings':
              return t('settings');
            default:
              return route.name;
          }
        };

        const iconColor = isFocused ? '#0c6dff' : '#64748b';
        const labelColor = isFocused ? '#0c6dff' : '#64748b';

        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={onPress}
          >
            <View style={styles.tabItem}>
              <View style={[
                styles.iconContainer,
                isFocused && styles.iconContainerActive
              ]}>
                <Ionicons
                  name={getIconName()}
                  size={isFocused ? 26 : 24}
                  color={iconColor}
                />
              </View>
              <Animated.Text style={[
                styles.tabLabel,
                { color: labelColor },
                isFocused && styles.tabLabelActive
              ]}>
                {getTitle()}
              </Animated.Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

const MainTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={DroughtStatusDashboard}
        />
        <Tab.Screen
          name="WaterSources"
          component={WaterSourcesMap}
        />
        <Tab.Screen
          name="Regions"
          component={RegionsScreen}
        />
        <Tab.Screen
          name="Report"
          component={ReportConditions}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  floatingIndicator: {
    position: 'absolute',
    top: 8,
    height: 4,
    backgroundColor: '#0c6dff',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(12, 109, 255, 0.1)',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.8,
  },
  tabLabelActive: {
    fontWeight: '700',
    opacity: 1,
  },
});

export default MainTabNavigator;