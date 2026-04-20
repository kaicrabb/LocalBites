/*
    This file defines the ManageReviews component, which is an admin interface for managing reviews. 
    It allows admins to view and manage reviews, including deleting reviews and viewing review details.
    The component checks if the current user is an admin before rendering the management options.
    Each option would navigate to a different screen for performing the respective action.
*/

import { View, Text, ScrollView, TouchableOpacity} from 'react-native';
import useUserInfo  from "../fetchuser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, Redirect } from "expo-router";

export default function ManageReviews() {
    const { user, loading } = useUserInfo();
    if (loading) {
            return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
        }
        if (!user?.IsAdmin) return <Redirect href="/main/home" />;
        else {
            console.log("User is admin:", user.IsAdmin, "User info:", user);
        }
        
    const router = useRouter();
    const handleDeleteReview = () => {
        console.log("Delete Review clicked");
        router.push("/admin/deleteReview");
    }
    
    const handleViewReviewDetails = () => {
        console.log("View Review Details clicked");
        router.push("/admin/viewReviews");
    }
    
    return (
        <ScrollView style={{ flex: 1}} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold'}}>Manage Reviews</Text>
            <Text style={{ marginTop: 20 }}>This is where you can manage reviews, including deleting reviews, and viewing review details.</Text>
            <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "red", borderRadius: 5, alignItems: "center", width: '80%'}} onPress={handleDeleteReview}>
                <MaterialCommunityIcons name="comment-remove" size={40} color="white" />
                <Text style={{ color: "white", fontWeight: "bold" }}>Delete Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "blue", borderRadius: 5, alignItems: "center", width: '80%' }} onPress={handleViewReviewDetails}>
                <MaterialCommunityIcons name="comment-eye" size={40} color="white" />
                <Text style={{ color: "white", fontWeight: "bold" }}>View Review Details</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
