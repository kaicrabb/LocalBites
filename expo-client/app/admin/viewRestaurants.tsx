/*
    This file defines the viewRestuarants component, which is an admin interface for viewing restaurant information.
    It allows admins to view a list of Restaurants, including their related reviews.
    The component checks if the current user is an admin before rendering the restaurant information. 
    This basically works as a way to view our restaurant and the related review folders of our Database without logging into Mongo.
*/

import {View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import useUserInfo  from "../fetchuser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

export default function ViewUsers() {
    const { user, loading } = useUserInfo();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<{ [key: string]: any }>({});
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    const toggleSection = (id: string, section: string) => {
        setExpanded(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [section]: !prev[id]?.[section],
            }
        }));
    };

    const fetchRestaurants = async () => {
        try {
            const response = await fetch(
                `https://localbites-4m9e.onrender.com/Admin/get_all_restaurants`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setRestaurants(data.restaurants);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(
                `https://localbites-4m9e.onrender.com/Admin/get_all_reviews`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setReviews(data.reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRestaurants();
            fetchReviews();
        }
    }, [token]);

    if (loading) {
        return (
            <View>
                <MaterialCommunityIcons name="loading" size={20} />
            </View>
        );
    }

    if (!user?.IsAdmin) return <Redirect href="/main/home" />;

    const filteredRestaurants = restaurants.filter((restaurant: any) =>
        restaurant.displayName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <View style={{paddingBottom:90}}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
                View Restaurants
            </Text>
            <Text style={{marginTop:15, fontWeight:'700'}}>Search Restaurant Names</Text>
            <TextInput
                placeholder="Search restaurants..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                }}
            />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            

            {filteredRestaurants.map((restaurant: any) => {const restaurantReviews = reviews.filter((review: any) => review.placeId === restaurant._id);
            return (
                
                <View
                    key={restaurant._id}
                    style={{
                        marginTop: 20,
                        padding: 15,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        {restaurant.displayName}
                    </Text>

                    <Text>Address: {restaurant.formattedAddress}</Text>
                    <Text>Phone: {restaurant.nationalPhoneNumber || "N/A"}</Text>
                    <Text>Website: {restaurant.websiteUri || "N/A"}</Text>
                    <Text>Rating: {restaurant.rating}</Text>
                    <Text>Price Level: {restaurant.priceLevel}</Text>
                    <Text>Primary Type: {restaurant.primaryType}</Text>

                    <TouchableOpacity onPress={() => toggleSection(restaurant._id, "services")}>
                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                            Services {expanded[restaurant._id]?.services ?  "▲" : "▼"}
                        </Text>
                    </TouchableOpacity>

                    {expanded[restaurant._id]?.services && (
                        <View style={{ marginLeft: 10 }}>
                            <Text>Dine-In: {restaurant.dineIn ? "Yes" : "No"}</Text>
                            <Text>Delivery: {restaurant.delivery ? "Yes" : "No"}</Text>
                            <Text>Breakfast: {restaurant.servesBreakfast ? "Yes" : "No"}</Text>
                            <Text>Lunch: {restaurant.servesLunch ? "Yes" : "No"}</Text>
                            <Text>Dinner: {restaurant.servesDinner ? "Yes" : "No"}</Text>
                        </View>
                    )}

                    <TouchableOpacity onPress={() => toggleSection(restaurant._id, "hours")}>
                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                            Hours {expanded[restaurant._id]?.hours ?  "▲" : "▼"}
                        </Text>
                    </TouchableOpacity>

                    {expanded[restaurant._id]?.hours && (
                        <View style={{ marginLeft: 10 }}>
                            <Text>
                                Open Now: {restaurant.regularOpeningHours?.openNow ? "Yes" : "No"}
                            </Text>

                            {restaurant.regularOpeningHours?.weekdayDescriptions?.map(
                                (day: string, index: number) => (
                                    <Text key={index}>{day}</Text>
                                )
                            )}
                        </View>
                    )}

                    <TouchableOpacity onPress={() => toggleSection(restaurant._id, "types")}>
                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                            Types {expanded[restaurant._id]?.types ?  "▲" : "▼"}
                        </Text>
                    </TouchableOpacity>

                    {expanded[restaurant._id]?.types && (
                        <View style={{ marginLeft: 10 }}>
                            {restaurant.types?.map((type: string, index: number) => (
                                <Text key={index}>• {type}</Text>
                            ))}
                        </View>
                    )}
                    
                    <TouchableOpacity onPress={() => toggleSection(restaurant._id, "photos")}>
                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                            Photos ({restaurant.photos?.length || 0}) {expanded[restaurant._id]?.photos ? "▲" : "▼"}
                        </Text>
                    </TouchableOpacity>

                    {expanded[restaurant._id]?.photos && (
                        <View style={{ marginLeft: 10 }}>
                            {restaurant.photos?.length ? (
                                <>
                                    <Text>Total Photos: {restaurant.photos.length}</Text>

                                    {/* Flatten + show authors */}
                                    {restaurant.photos.map((photo: any, index: number) => (
                                        <Text key={index}>
                                            Photo by: {photo.authorAttributions?.[0]?.displayName || "Unknown"}
                                        </Text>
                                    ))}
                                </>
                            ) : (
                                <Text>No photos available</Text>
                            )}
                        </View>
                    )} 
                    <TouchableOpacity onPress={() => toggleSection(restaurant._id, "reviews")}>
                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                            Reviews ({restaurantReviews.length}) {expanded[restaurant._id]?.reviews ? "▲" : "▼"}
                        </Text>
                    </TouchableOpacity>

                    {expanded[restaurant._id]?.reviews && (
                        <View style={{ marginLeft: 10 }}>
                            {restaurantReviews.length > 0 ? (
                                restaurantReviews.map((review: any, index: number) => (
                                    <View
                                        key={review._id || index}
                                        style={{
                                            marginTop: 8,
                                            paddingBottom: 8,
                                            borderBottomWidth: 1,
                                            borderColor: '#eee'
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold' }}>{review.username || "Anonymous"}</Text>
                                        <Text>Rating: {review.rating}</Text>
                                        <Text>{review.comment || "No comment provided"}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text>No reviews available</Text>
                            )}
                        </View>
                    )}
                    </View> 
            )})}   
        </ScrollView>
        </View>
    );
}