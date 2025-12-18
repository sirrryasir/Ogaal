import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/splashScreen/index';
import OnboardingScreen from '../screens/onboarding/index';
import MainTabNavigator from './MainTabNavigator';
import AboutScreen from '../screens/main/About/index';
import NotificationDetailsScreen from '../screens/main/Notifications/NotificationDetailsScreen';
import SettingsScreen from '../screens/main/Settings';
import AccountSettingsScreen from '../screens/main/Settings/AccountSettingsScreen';
import NotificationSettingsScreen from '../screens/main/Settings/NotificationSettingsScreen';
import LanguageSelectScreen from '../screens/main/LanguageSelect';
import PrivacySecurityScreen from '../screens/main/Settings/PrivacySecurityScreen';
import HelpSupportScreen from '../screens/main/Settings/HelpSupportScreen';
import RegionDetails from '../screens/main/Regions/RegionDetailsScreen';
import NearbySourcesScreen from '../screens/main/Regions/NearbySourcesScreen';
import SubDistrict from '../screens/main/Regions/SubDistrictScreen';
import WaterSources from '../screens/main/Regions/WaterSourcesScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <Stack.Screen name="NotificationDetails" component={NotificationDetailsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="RegionDetails" component={RegionDetails} />
      <Stack.Screen name="NearbySources" component={NearbySourcesScreen} /> 
      <Stack.Screen name="SubDistrict" component={SubDistrict} /> 
      <Stack.Screen name="WaterSources" component={WaterSources} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;