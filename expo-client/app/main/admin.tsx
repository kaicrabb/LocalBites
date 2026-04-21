import { useRouter, Redirect } from "expo-router";
import { Text, ScrollView, View, TouchableOpacity} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserInfo  from "../fetchuser";


export default function AdminPage() {
    const { user, loading } = useUserInfo();
    const router = useRouter();

    if (loading) {
        return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
    }
    if (!user?.IsAdmin) return <Redirect href="/main/home" />;
    else {
        console.log("User is admin:", user.IsAdmin, "User info:", user);
    }

    const handleManageUsers = () => {
        console.log("Manage Users clicked");
        router.push("/admin/manageUsers");
    };

    const handleManageReviews = () => {
        console.log("Manage Reviews clicked");
        router.push("/admin/manageReviews");
    };

    const handleManagePlaces = () => {
        console.log("Manage Places clicked");
        router.push("/admin/managePlaces");
    };

    const handleManageContent = () => {
        console.log("Manage Content clicked");
        router.push("/admin/manageContent");
    }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Admin Panel
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Welcome, {user?.Username}! You have admin access.
      </Text>
      <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "red", borderRadius: 5, alignItems: "center" }} onPress={handleManageUsers}>
        <MaterialCommunityIcons name="account-cancel" size={40} color="white" />
        <Text style={{ color: "white", fontWeight: "bold" }}>Manage User Profiles</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "orange", borderRadius: 5, alignItems: "center" }} onPress={handleManageReviews}>
        <MaterialCommunityIcons name="comment-edit" size={40} color="white" />
        <Text style={{ color: "white", fontWeight: "bold" }}>Manage Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "purple", borderRadius: 5, alignItems: "center" }} onPress={handleManagePlaces}>
        <MaterialCommunityIcons name="map-marker" size={40} color="white" />
        <Text style={{ color: "white", fontWeight: "bold" }}>Manage Places</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}