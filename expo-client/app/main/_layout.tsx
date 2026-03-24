import { Tabs, Stack} from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
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
  </Tabs>
);
};
