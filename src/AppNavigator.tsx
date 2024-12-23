import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddItemScreen from './screens/AddItemScreen';
import SettingScreen from './screens/SettingScreen'; // Correct import
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for icons

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Check if user is logged in using AsyncStorage
const isUserLoggedIn = async () => {
  try {
    const userLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    return userLoggedIn === 'true'; // Check if login state is saved
  } catch (error) {
    console.error('Failed to fetch login status:', error);
    return false;
  }
};

// Stack Navigator for Login and Register
const AuthStack = ({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) => (
  <Stack.Navigator>
    <Stack.Screen name="Login" options={{ headerShown: false }}>
      {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// Bottom Tab Navigator for the main app screens with icons
const AppTabs = ({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string = '';

        // Set icon based on the route name
        if (route.name === 'Home') {
          iconName = 'home'; // Home icon
        } else if (route.name === 'Add Item') {
          iconName = 'plus'; // Plus icon for Add Item
        } else if (route.name === 'Settings') {
          iconName = 'cog'; // Gear icon for settings
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'darkgreen', // Color of the icon when clicked
      tabBarInactiveTintColor: 'grey', // Color of the icon when inactive
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Add Item" component={AddItemScreen} />
    <Tab.Screen
      name="Settings" options={{ headerShown: false }}
      children={(props) => <SettingScreen {...props} setIsLoggedIn={setIsLoggedIn} />} // Pass props to SettingsScreen
    />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await isUserLoggedIn();
      setIsLoggedIn(loggedIn);
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppTabs setIsLoggedIn={setIsLoggedIn} /> // Pass setIsLoggedIn to AppTabs
      ) : (
        <AuthStack setIsLoggedIn={setIsLoggedIn} /> // Pass setIsLoggedIn to AuthStack
      )}
    </NavigationContainer>
  );
}
