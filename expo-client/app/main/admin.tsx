import { Redirect } from "expo-router";
import { Text, ScrollView, View} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserInfo  from "../fetchuser";

interface User {
  _id: string;
  Username: string;
  IsAdmin: boolean;
}

export default function AdminPage() {
    const { user, loading } = useUserInfo();
      

    if (loading) {
        return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
    }
    if (!user?.IsAdmin) return <Redirect href="/main/home" />;
    else {
        console.log("User is admin:", user.IsAdmin, "User info:", user);
    }


  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Admin Panel
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Welcome, {user?.Username}! You have admin access.
      </Text>
      {/* Add admin functionalities here */}
    </ScrollView>
  );
}