/*
    This file defines the UnbanUser component, which is an admin interface for unbanning users. 
    It allows admins to view a list of banned users and select a user to unban.
    When a user is selected for unbanning, a confirmation dialog is shown where the admin can confirm the unban action. 
    The component checks if the current user is an admin before rendering the unbanning options.
*/

import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useState, useEffect } from "react";
import useUserInfo from "../fetchuser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import * as secureStore from 'expo-secure-store';

export default function UnbanUser() {
    const [users, setUsers] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const { user, loading } = useUserInfo();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await secureStore.getItemAsync('token');
            setToken(storedToken);
        };
        getToken();
    }, []);
    
    
    const fetchBannedUsers = async () => {
        try {
            console.log("Fetching banned users...");
            const response = await fetch(
                `https://localbites-4m9e.onrender.com/Admin/get_all_bans`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log("Banned users fetched:", data);
            setUsers(data.bans);
        } catch (error) {
            console.error("Error fetching banned users:", error);
        }
    };

        // Call fetchBannedUsers when the component mounts
    useEffect(() => {
        if (token) {
            fetchBannedUsers();
        }
    }, [token]);
    
    if (loading) {
        return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
    }
    if (!user?.IsAdmin) return <Redirect href="/main/home" />;





    const handleUnban = async (userId: string) => {
        try {
            console.log(`Unbanning user with ID: ${userId}`);
            const response = await fetch(
                `https://localbites-4m9e.onrender.com/Admin/unban_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log("User unbanned successfully:", data);
                // Refresh the list of banned users after unbanning
                fetchBannedUsers();
            }
            else {
                console.error("Failed to unban user:", data);
            }
        } catch (error) {
            console.error("Error unbanning user:", error);
        }
    };

    const filteredUsers = users.filter((ban: any) =>
        ban.username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <View>
            <Text style={{marginTop:15, fontWeight:'700'}}>Search by Username</Text>
            <TextInput
                placeholder="Search by Username..."
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
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Unban Users</Text>
            <Text style={{ marginBottom: 15 }}>This is where you can unban a user. You can select a user from the list of banned users and confirm the unban action.</Text>
            {filteredUsers.length === 0 ? (
                <Text style={{fontWeight:'bold', fontSize:24, paddingTop:30, color:'red'}}>No banned users found.</Text>
            ) : (
                filteredUsers.map((ban) => (
                    <View key={ban._id} style={{ marginBottom: 15, padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{ban.username}</Text>
                        <Text>Reason: {ban.reason}</Text>
                        <Text>Banned on: {new Date(ban.bannedAt).toLocaleDateString()}</Text>
                        <Text>Ban Expires On: {new Date(ban.expiresAt).toLocaleDateString()}</Text>
                        <TouchableOpacity style={{ marginTop: 10, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }} onPress={() => handleUnban(ban.userId)}>
                            {/* Should add a confirmation dialog */}
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Unban User</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </ScrollView>
        </View>
    );
}