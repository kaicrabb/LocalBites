/*
    This file defines the DeleteReview component, which is an admin interface for deleting reviews.
    It allows admins to view a list of reviews with options to delete each review.
    The component checks if the current user is an admin before rendering the review information. 
*/

import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserInfo from "../fetchuser";
import { Redirect } from "expo-router";
import * as secureStore from 'expo-secure-store';
import { useState, useEffect } from "react";

export default function DeleteReview() {
    const { user, loading } = useUserInfo();
    const [reviews, setReviews] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
        useEffect(() => {
        const getToken = async () => {
            const storedToken = await secureStore.getItemAsync('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    const fetchReviews = async () => {
        console.log("Fetching reviews...");
        const response = await fetch(`https://localbites-4m9e.onrender.com/Admin/get_all_reviews`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        console.log("Reviews fetched:", data);
        setReviews(data.reviews);
    };

    useEffect(() => {
        if (token) {
            fetchReviews();
        }
    }, [token]);

    if (loading) {
        return <View><MaterialCommunityIcons name="loading" size={20} /></View>;
    }
    if (!user?.IsAdmin) return <Redirect href="/main/home" />;

    const handleDeleteReview = (reviewId: string) => {
        console.log(`Delete review with ID: ${reviewId}`);
        const deleteReview = async () => {
            try {
                const response = await fetch(`https://localbites-4m9e.onrender.com/Admin/delete_review`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ reviewId }),
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Review deleted:", data);
                    // Update the reviews list after deletion
                    fetchReviews();
                }
                else {
                    console.error("Error deleting review:", data);
                }
            }
            catch (error) {
                console.error("Error deleting review:", error);
            }
        };
        deleteReview();
        setReviewToDelete(null);
    }

        const handleconfirmDelete = (reviewId: string) => {
        console.log(`Confirm delete for user ID: ${reviewId}`);
        setReviewToDelete(reviewId);
    }

    const handleCancelDelete = () => {
        console.log("Cancel delete");
        setReviewToDelete(null); // Close the confirmation form
    };
    
    if (reviewToDelete) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>Are you sure you want to delete this review?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%' }}>
                    <TouchableOpacity style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, alignItems: 'center', flex: 1, marginRight: 10 }} onPress={() => handleDeleteReview(reviewToDelete)}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Yes, Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10, backgroundColor: 'gray', borderRadius: 5, alignItems: 'center', flex: 1, marginLeft: 10 }} onPress={handleCancelDelete}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>No, Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
         <ScrollView style={{ flex: 1}} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ fontSize: 24, fontWeight: 'bold'}}>Delete Review</Text>
                <Text style={{ marginTop: 20 }}>This is where you can delete reviews. You would see a list of reviews with options to delete each review.</Text>
                    {/* Map through the reviews and display them with a delete button*/}
                {reviews.map((review) => (
                    <View key={review.id} style={{ marginTop: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5, width: '80%', borderColor:'grey', borderBottomWidth:4}}>
                        <Text style={{ fontWeight: "bold" }}>{review.username?? "Unknown User"}</Text>
                        <Text>Restaurant: {review.restaurantName?? "Unknown Restaurant"}</Text>
                        <Text>Rating: {review.rating}</Text>
                        <Text style={{backgroundColor: 'lightgrey'}}>{review.comment}</Text>
                        <TouchableOpacity style={{ marginTop: 10, padding: 10, backgroundColor: 'red', borderRadius: 5, alignItems: 'center' }} onPress={()=>setReviewToDelete(review.id)}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Review</Text>
                        </TouchableOpacity>
                    </View>
                ))}
         </ScrollView>
    );
}