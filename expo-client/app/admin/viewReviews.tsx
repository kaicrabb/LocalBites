/*
    This file defines the ViewReviews component, which is an admin interface for viewing review information.
    It allows admins to view a list of reviews, including the related user and restaurant information.
    The component checks if the current user is an admin before rendering the review information.
    This basically acts as a way to view the reviews folder of our database without signing in to Mongo. 
*/

import {View, Text, ScrollView} from 'react-native';
import useUserInfo  from "../fetchuser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

export default function ViewReviews() {
    const { user, loading } = useUserInfo();
    const [reviews, setReviews] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    
    useEffect(() => {
        const getToken = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    const fetchReviews = async () => {
        try {           
            console.log("Fetching users...");
            // Fetch users from the backend API
            const response = await fetch(`https://localbites-4m9e.onrender.com/Admin/get_all_reviews`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setReviews(data.reviews);
            console.log("reviews fetched:", data.reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    
    useEffect(() => {
        if (token) {
            fetchReviews()
        }
    }, [token]);


    if (loading) {
            return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
        }
        if (!user?.IsAdmin) return <Redirect href="/main/home" />;

    const groupedReviews = Object.values(
        reviews.reduce((acc: any, review: any) => {
            const key = review.userId || "unknown";

            if (!acc[key]) {
                acc[key] = {
                    userId: review.userId,
                    username: review.username,
                    email: review.email,
                    reviews: []
                };
            }

            acc[key].reviews.push(review);
            return acc;
        }, {})
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>View Users</Text>
            <Text style={{ marginTop: 20 }}>This is where you can view all users, including their profile information and activity history.</Text>
            {groupedReviews.map((userGroup: any) => (
                <View
                    key={userGroup.userId}
                    style={{
                        marginTop: 20,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                        width: '90%',
                    }}
                >
                    {/* User Info */}
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        {userGroup.username ?? "Unknown User"}
                    </Text>
                    <Text>Email: {userGroup.email ?? "N/A"}</Text>
                    <Text>UserID: {userGroup.userId}</Text>

                    {/* Reviews under user */}
                    {userGroup.reviews.map((review: any, index: number) => (
                        <View
                            key={review.id || index}
                            style={{
                                marginTop: 10,
                                paddingTop: 10,
                                borderTopWidth: index === 0 ? 0 : 1,
                                borderColor: '#ccc'
                            }}
                        >
                            <Text style={{ fontSize:16, fontWeight: '500' }}>
                                Restaurant: {review.restaurantName ?? "Unknown"}
                            </Text>
                            <Text>
                                Address: {review.formattedAddress ?? "Unknown Address"}
                            </Text>
                            <Text>PlaceID: {review.placeId}</Text>

                            {/* Stars */}
                            <Text>
                                {Array.from({ length: 5 }, (_, i) => {
                                    const starIndex = i + 1;
                                    return (
                                        <Text
                                            key={starIndex}
                                            style={{
                                                color:
                                                    starIndex <= review.rating
                                                        ? '#FFD700'
                                                        : '#ccc'
                                            }}
                                        >
                                            ★
                                        </Text>
                                    );
                                })}
                            </Text>

                            <Text>Comment:</Text>
                            <Text style={{ backgroundColor: "lightgrey" }}>
                                {review.comment ?? "No comment"}
                            </Text>
                        </View>
                    ))}
                </View>
            ))}
            <Text/>
        </ScrollView>
    );
}