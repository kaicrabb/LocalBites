/*
    This file defines the ViewUsers component, which is an admin interface for viewing user information.
    It allows admins to view a list of users, including their profile information and activity history.
    The component checks if the current user is an admin before rendering the user information. 
    This basically works as a way to view our bans and user folders of our Database without logging into Mongo.
*/

import {View, Text, ScrollView, TextInput} from 'react-native';
import useUserInfo  from "../fetchuser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

export default function ViewUsers() {
    const { user, loading } = useUserInfo();
    const [users, setUsers] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [bannedUsers, setbannedUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    
     useEffect(() => {
        const getToken = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    const fetchUsers = async () => {
        try {           
            console.log("Fetching users...");
            // Fetch users from the backend API
            const response = await fetch(`https://localbites-4m9e.onrender.com/Admin/get_all_users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUsers(data.users);
            console.log("Users fetched:", data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchBannedUsers = async () => {
        try {
            console.log("Fetching banned users...");
            // Fetch banned users from the backend API
            const response = await fetch(`https://localbites-4m9e.onrender.com/Admin/get_all_bans`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log("Banned users fetched:", data.bans);
            setbannedUsers(data.bans);
        
        } catch (error) {
            console.error("Error fetching banned users:", error);
        }
    };
    
    useEffect(() => {
        if (token) {
            fetchUsers();
            fetchBannedUsers();
        }
    }, [token]);


    if (loading) {
            return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
        }
        if (!user?.IsAdmin) return <Redirect href="/main/home" />;

    const filteredUsers = users.filter((restaurant: any) =>
        restaurant.Username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <View style={{paddingBottom:90}}>
            <Text style={{marginTop:15, fontWeight:'700'}}>Search by Usernames</Text>
            <TextInput
                placeholder="Search by username..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                }}
            />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>View Users</Text>
            <Text style={{ marginTop: 20 }}>This is where you can view all users, including their profile information and activity history.</Text>
            {filteredUsers.map((user: any) => (
                <View key={user._id} style={{ marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, width: '90%' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{user.Username}</Text>
                    <Text>Email: {user.Email}</Text>
                    <Text>UserID: {user._id}</Text>
                    <Text>Banned: {user.isBanned ? 'Yes' : 'No'}</Text>
                    {/* If user is banned, display ban details by pulling that from fetchBannedUsers */}
                    {user.isBanned && (bannedUsers as any[]).find((ban: any) => ban.userId?.toString() === user._id?.toString()) && (
                        <View style={{ marginTop: 10, padding: 10, backgroundColor: '#f8d7da', borderRadius: 5 }}>
                            <Text style={{ fontWeight: 'bold', color: '#721c24' }}>Ban Details:</Text>
                            <Text style={{ color: '#721c24' }}>Reason: {bannedUsers.find((ban: any) => ban.userId?.toString() === user._id?.toString())?.reason || 'N/A'}</Text>
                            <Text style={{ color: '#721c24' }}>Banned on: {new Date(bannedUsers.find((ban: any) => ban.userId?.toString() === user._id?.toString())?.bannedAt || '').toLocaleDateString() || 'N/A'}</Text>
                            <Text style={{ color: '#721c24' }}>Banned until: {new Date(bannedUsers.find((ban: any) => ban.userId?.toString() === user._id?.toString())?.expiresAt || '').toLocaleDateString() || 'N/A'}</Text>
                        </View>
                    )}
                    <Text>Admin: {user.isAdmin ? 'Yes' : 'No'}</Text>
                    {/* Add more user details as needed */}
                    
                </View>
            ))}
        </ScrollView>
        </View>
    );
}