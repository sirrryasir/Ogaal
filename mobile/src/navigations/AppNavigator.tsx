import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/splashScreen/index';
import OnboardingScreen from '../screens/onboarding/index';
import MainTabNavigator from './MainTabNavigator';
import AboutScreen from '../screens/main/About/index';
import LanguageSelectScreen from '../screens/main/LanguageSelect/index';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;