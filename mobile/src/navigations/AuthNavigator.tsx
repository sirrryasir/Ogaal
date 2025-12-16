import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/Login/index';
import RegisterScreen from '../screens/auth/Register/index';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword/index';
import OTPScreen from '../screens/auth/OTP/index';
import CreatePasswordScreen from '../screens/auth/CreatePassword/index';
import UpdatePasswordScreen from '../screens/auth/UpdatePassword/index';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
      <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;