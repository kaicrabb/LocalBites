import { Tabs, Stack, useRouter} from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import useUserInfo from "../fetchuser";
import { View, Text } from "react-native";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function RootLayout() {
  const { user, loading } = useUserInfo();
  const router = useRouter();
  
  
  if (loading && user === null) {
    delay(2000).then(() => {
      console.log("Loading user info...");
    });
    return null; // should make a loading screen here
  }

  if(!loading) {
    console.log("User info loaded in RootLayout: ", user);
    if (user?.isBanned) {// show message then log out user
      delay(3000).then(() => {
        console.log("Logging out banned user...");
        SecureStore.deleteItemAsync("token");
        SecureStore.deleteItemAsync("user");
        router.replace("/");
      });
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
            Your account has been banned. You will be logged out shortly.
          </Text>
        </View>
      );
    }

  }

  return (
  <Tabs>
    <Tabs.Screen name="reels" 
    options={{ 
      title: "Reels",
      tabBarLabel: "Reels",
      tabBarIcon: ({ color, size }) => <Ionicons name="film" color={color} size={size} />
      }} />
    <Tabs.Screen name="home" 
    options={{ 
      title: "Home",
      tabBarLabel: "Home",
      tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />
      }} />
      <Tabs.Screen name="upload" 
    options={{ 
      title: "Upload",
      tabBarLabel: "Upload",
      tabBarIcon: ({ color, size }) => <Ionicons name="add" color={color} size={size} />
      }} />
    <Tabs.Screen name="profile" 
    options={{ 
      title: "Profile",
      tabBarLabel: "Profile",
      tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />
      }} />
    <Tabs.Screen
  name="admin"
  options={{
    title: "Admin",
    tabBarLabel: "Admin",
    tabBarIcon: ({ color, size }) => <Ionicons name="construct" color={color} size={size} />,
    tabBarItemStyle: user?.IsAdmin ? {} : { display: 'none' },
  }} />
      <Tabs.Screen name="video/[videoURL]" 
    options={{ 
      href: null,
    }} 
/>
  </Tabs>
);
};
