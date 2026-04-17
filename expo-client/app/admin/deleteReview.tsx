/*
    This file defines the DeleteReview component, which is an admin interface for deleting reviews.
    It allows admins to view a list of reviews with options to delete each review.
    The component checks if the current user is an admin before rendering the review information. 
*/

import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserInfo from "../fetchuser";
import { Redirect } from "expo-router";

export default function DeleteReview() {
    const { user, loading } = useUserInfo();
    if (loading) {
        return <View><MaterialCommunityIcons name="loading" size={20} /></View>;
    }
    if (!user?.IsAdmin) return <Redirect href="/main/home" />;

    const fetchReviews = async () => {
        console.log("Fetching reviews...");
    }


    return (
         <ScrollView style={{ flex: 1}} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ fontSize: 24, fontWeight: 'bold'}}>Delete Review</Text>
                <Text style={{ marginTop: 20 }}>This is where you can delete reviews. You would see a list of reviews with options to delete each review.</Text>
                <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "red", borderRadius: 5, alignItems: "center", width: '80%' }} onPress={() => console.log("Delete Review clicked")}>
                    <MaterialCommunityIcons name="comment-remove" size={40} color="white" />
                    <Text style={{ color: "white", fontWeight: "bold" }}>Delete Review</Text>
                </TouchableOpacity>
         </ScrollView>
    );
}