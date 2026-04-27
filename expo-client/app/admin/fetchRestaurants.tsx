/*
    This file defines the fetchRestuarants component, which is an admin interface for fetching restaurant information from the google API.
    It allows admins to view a input a town and State to run a Google API request on.
    The component checks if the current user is an admin before running the request for new restaurant information. 
    This basically works as a way to add restaurant info for towns without logging into the app in that town or using backend calls to the request.
*/

import {ScrollView, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { useState, useEffect } from 'react';
import * as secureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import useUserInfo from '../fetchuser';
import { Redirect } from 'expo-router';

export default function fetchRestaruants() {
    const [token, setToken] = useState<string | null>(null);
    const { user, loading } = useUserInfo();
    const [town, setTown] = useState("");
    const [state, setState] = useState("");
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await secureStore.getItemAsync('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    const states: string[] = [
        "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
        "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
        "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
        "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
        "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
        "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
        "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
        "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
    ];

    const fetchRestaurants = async () => {
        if (!town || !state) return;

        try {
            setLoadingData(true);

            const response = await fetch("https://localbites-4m9e.onrender.com/Admin/fetch_new_restaurant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ town, state })
            });

            const data = await response.json();
            console.log(data)
            if (data.success) {
                setRestaurants(data.data);
                console.log(restaurants);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoadingData(false);
        }
    };

    
    if (!loading && (!user || !user.IsAdmin)) {
        return <Redirect href="/" />;
    }

    return (
        <View style={{ flex: 1, padding: 16}}>
            <Text> Enter a town name and select a state to add new restaurants from that town. </Text>
            {}
            <TextInput
                placeholder="Enter town"
                value={town}
                onChangeText={setTown}
                style={{
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 6
                }}
            />
            <View style={{backgroundColor: 'rgb(87, 86, 85)', borderRadius: 10, overflow: "hidden" }}>
                <Picker
                    selectedValue={state}
                    onValueChange={(itemValue) => setState(itemValue)}
                    style={{ marginBottom: 10}}
                >
                    <Picker.Item label="Select a state..." value="" />
                    {states.map((s) => (
                        <Picker.Item key={s} label={s} value={s} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity
                onPress={fetchRestaurants}
                style={{
                    backgroundColor: "#007bff",
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 15
                }}
            >
                <Text style={{ color: "white", textAlign: "center" }}>
                    Fetch Restaurants
                </Text>
            </TouchableOpacity>

            
            <ScrollView style={{ flex: 1 }}>
                {loadingData && <Text>Loading...</Text>}

                {restaurants.map((r, index) => (
                    <View
                        key={index}
                        style={{
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 6,
                            marginBottom: 10
                        }}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                            {r.name}
                        </Text>

                        <Text>{r.address}</Text>
                        <Text>
                            {Array.from({ length: 5 }, (_, i) => {
                                const starIndex = i + 1;
                                return (
                                    <Text
                                        key={starIndex}
                                        style={{
                                            color:
                                                starIndex <= r.rating
                                                ? '#FFD700'
                                                : '#ccc'
                                        }}
                                    >
                                        ★
                                    </Text>
                                );
                            })}
                        </Text>
                    </View>
                ))}
            </ScrollView>

        </View>
    );
}