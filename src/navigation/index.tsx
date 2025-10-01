import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VehiclesListScreen from '../screens/vehicles/VehiclesListScreen';
import VehicleFormScreen from '../screens/vehicles/VehicleFormScreen';
import MechanicsListScreen from '../screens/mechanics/MechanicsListScreen';
import MechanicFormScreen from '../screens/mechanics/MechanicFormScreen';
import DepositsListScreen from '../screens/deposits/DepositsListScreen';
import DepositFormScreen from '../screens/deposits/DepositFormScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { useTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: string = 'list';
          if (route.name === 'Motos') iconName = 'car';
          else if (route.name === 'Mecânicos') iconName = 'construct';
          else if (route.name === 'Depósitos') iconName = 'cube';
          else if (route.name === 'Perfil') iconName = 'person';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
  <Tab.Screen name="Motos" component={VehiclesListScreen} />
  <Tab.Screen name="Mecânicos" component={MechanicsListScreen} />
  <Tab.Screen name="Depósitos" component={DepositsListScreen} />
  <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function RootNavigation() {
  const { token, initialized } = useAuth();
  const { mode } = useTheme();
  if (!initialized) return null; // could show splash/loading

  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
      {token ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
          <Stack.Screen name="VehicleForm" component={VehicleFormScreen} options={{ title: 'Moto' }} />
          <Stack.Screen name="MechanicForm" component={MechanicFormScreen} options={{ title: 'Mecânico' }} />
          <Stack.Screen name="DepositForm" component={DepositFormScreen} options={{ title: 'Depósito' }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crie sua conta' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
