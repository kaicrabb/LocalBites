/*
    * This file defines the React Native component for the "Delete Restaurant" screen in the admin section of the LocalBites app.
    * It allows admins to view a list of all Restuarants and delete Restaurants accounts as needed.
    * The component fetches the list of restaurants from the server when it mounts and displays them in a scrollable view.
    * Each Restaurant entry includes a "Delete Restuarant" button that triggers a confirmation prompt before sending a request to the server to delete the restaurant.
    * The component also checks if the current user is an admin and redirects non-admin users back to the home screen.
*/
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react';
import * as secureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useUserInfo from '../fetchuser';
import { Redirect } from 'expo-router';

export default function DeleteRestaurantAccount() {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const { user, loading } = useUserInfo();
    const [restaurantToDelete, setRestaurantToDelete] = useState<string | null>(null);
    useEffect(() => {
        const getToken = async () => {
            const storedToken = await secureStore.getItemAsync('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    const fetchRestaurants = async () => {
        try {
            console.log("Fetching restaurants...");
            const response = await fetch(
                `https://localbites-4m9e.onrender.com/Admin/get_all_restaurants`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }); 
            const data = await response.json();
            console.log("restaurants fetched:", data);
            setRestaurants(data.restaurants);
        }
        catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    // Call fetchrestaurants when the component mounts
    useEffect(() => {
        if (token) {
            fetchRestaurants();
        }
    }, [token]);

    if (loading) {
        return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
    }
    if (!user?.IsAdmin) return <Redirect href="/main/home" />;


    const handleconfirmDelete = (restaurantId: string) => {
        console.log(`Confirm delete for restaurant ID: ${restaurantId}`);
        // Show a confirmation prompt before deleting the restaurant by opening a confirmation form
        setRestaurantToDelete(restaurantId); // Set the restaurant ID to be deleted in the state to show the confirmation form
    };

    const handleCancelDelete = () => {
        console.log("Cancel delete");
        setRestaurantToDelete(null); // Close the confirmation form
    };

    const handleDeleteRestaurant = (restaurantId: string) => {
        console.log(`Delete restaurant confirmed for restaurant ID: ${restaurantId}`);
        // Implement the logic to delete the restaurant account using the restaurantId
        const deleteRestaurant = async () => {
            try {
                const response = await fetch(`https://localbites-4m9e.onrender.com/Admin/remove_restaurant`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ restaurantId }),
                });
                if (response.ok) {
                    console.log(`restaurant with ID: ${restaurantId} deleted successfully`);
                    alert('Restaurant Deleted')
                    // Refresh the restaurant list after deletion
                    fetchRestaurants();
                }
                else {
                    console.error(`Failed to delete Restaurant with ID: ${restaurantId}`, await response.text());
                }
            }
            catch (error) {
                console.error(`Error deleting restaurant with ID: ${restaurantId}`, error);
            }
        };
        deleteRestaurant();
        setRestaurantToDelete(null); // Close the confirmation form after deletion
    };

    if (restaurantToDelete) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>Are you sure you want to delete this restaurant?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%' }}>
                    <TouchableOpacity style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, alignItems: 'center', flex: 1, marginRight: 10 }} onPress={() => handleDeleteRestaurant(restaurantToDelete)}>
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
        <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Delete Restaurant</Text>
            {restaurants.map((restaurant) => (
                <View key={restaurant._id} style={{ marginBottom: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5,  alignContent: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ccc', width: '90%' }}>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{restaurant.displayName}</Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', color: '#333' }}>{restaurant.formattedAddress}</Text>
                    <TouchableOpacity style={{ marginTop: 10, padding: 10, backgroundColor: 'red', borderRadius: 5, alignItems: 'center' }} onPress={() => handleconfirmDelete(restaurant._id)}>
                        <MaterialCommunityIcons name="storefront-remove" size={20} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Restaurant</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}