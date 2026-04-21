/*
    This file defines the ManagePlaces component, which is an admin interface for managing restaurant information.
    It allows admins to view and manage restaurants, including adding, editing, viewing, and deleting restaurant information.
    The component checks if the current user is an admin before rendering the management options.
    Each option would navigate to a different screen for performing the respective action.
*/

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import useUserInfo  from "../fetchuser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, Redirect } from "expo-router";

export default function ManagePlaces() {
    const { user, loading } = useUserInfo();

    if (loading) {
            return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
        }
        if (!user?.IsAdmin) return <Redirect href="/main/home" />;
        else {
            console.log("User is admin:", user.IsAdmin, "User info:", user);
        }

    const router = useRouter();
    const handleDeleteRestaurant = () => {
        console.log("Delete Review clicked");
        router.push("/admin/deleteRestaurant");
    }
    
    const handleViewRestaurantDetails = () => {
        console.log("View Review Details clicked");
        router.push("/admin/viewRestaurants");
    }

    return (
        <ScrollView style={{ flex: 1}} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold'}}>Manage Restaurants</Text>
                    <Text style={{ marginTop: 20 }}>This is where you can manage restaurants, including deleting restaurants, and viewing restaurant details.</Text>
                    <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "red", borderRadius: 5, alignItems: "center", width: '80%'}} onPress={handleDeleteRestaurant}>
                        <MaterialCommunityIcons name="storefront-remove" size={40} color="white" />
                        <Text style={{ color: "white", fontWeight: "bold" }}>Delete Restaurant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "blue", borderRadius: 5, alignItems: "center", width: '80%' }} onPress={handleViewRestaurantDetails}>
                        <MaterialCommunityIcons name="database-eye" size={40} color="white" />
                        <Text style={{ color: "white", fontWeight: "bold" }}>View Restaurant Details</Text>
                    </TouchableOpacity>
                </ScrollView>
            );
}
