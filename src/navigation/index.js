import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen         from '../screens/SplashScreen';
import LoginScreen          from '../screens/LoginScreen';
import RegisterScreen       from '../screens/RegisterScreen';
import EmailConfirmScreen   from '../screens/EmailConfirmScreen';
import CheckInScreen        from '../screens/CheckInScreen';
import HotelScreen          from '../screens/HotelScreen';
import NearbyScreen         from '../screens/NearbyScreen';
import MessagesScreen       from '../screens/MessagesScreen';
import ChatScreen           from '../screens/ChatScreen';
import MapScreen            from '../screens/MapScreen';
import ProfileScreen        from '../screens/ProfileScreen';
import NotificationsScreen  from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown:false }}>
        <Stack.Screen name="Splash"         component={SplashScreen}        />
        <Stack.Screen name="Login"          component={LoginScreen}         />
        <Stack.Screen name="Register"       component={RegisterScreen}      />
        <Stack.Screen name="EmailConfirm"   component={EmailConfirmScreen}  />
        <Stack.Screen name="CheckIn"        component={CheckInScreen}       />
        <Stack.Screen name="Hotel"          component={HotelScreen}         />
        <Stack.Screen name="Nearby"         component={NearbyScreen}        />
        <Stack.Screen name="Messages"       component={MessagesScreen}      />
        <Stack.Screen name="Chat"           component={ChatScreen}          />
        <Stack.Screen name="Map"            component={MapScreen}           />
        <Stack.Screen name="Profile"        component={ProfileScreen}       />
        <Stack.Screen name="Notifications"  component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
