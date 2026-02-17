import { Tabs, Stack} from "expo-router";

export default function RootLayout() {
  return (
  <Tabs>
    <Tabs.Screen name="reels" 
    options={{ 
      title: "Reels",
      tabBarLabel: "Reels",
      }} />
    <Tabs.Screen name="home" 
    options={{ 
      title: "Home",
      tabBarLabel: "Home",
      }} />
    <Tabs.Screen name="profile" 
    options={{ 
      title: "Profile",
      tabBarLabel: "Profile",
      }} />
  </Tabs>
);
};
