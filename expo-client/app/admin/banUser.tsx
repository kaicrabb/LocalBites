/*
    This file defines the BanUser component, which is an admin interface for banning users. 
    It allows admins to view a list of users and select a user to ban.
    When a user is selected for banning, a confirmation dialog is shown where the admin can provide a reason for the ban and specify the duration of the ban. 
    The component checks if the current user is an admin before rendering the banning options.
*/
import { ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import * as secureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useUserInfo from '../fetchuser';
import { Redirect } from 'expo-router';

export default function BanUser() {
    const [users, setUsers] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [showUserToBan, setShowUserToBan] = useState<string | null>(null);
    const [violation, setViolation] = useState<string>('');
    const [banDuration, setBanDuration] = useState<number>(0);
    const { user, loading } = useUserInfo();

    
    
        useEffect(() => {
        const getToken = async () => {
            const storedToken = await secureStore.getItemAsync('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    const fetchUsers = async () => {
        try {
            console.log("Fetching users...");
            const response = await fetch(
                `https://localbites-4m9e.onrender.com/Admin/get_all_users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log("Users fetched:", data);
            const alreadyBannedUserIds = await fetch('https://localbites-4m9e.onrender.com/Admin/get_all_bans', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(res => res.json()).then(data => data.bans.map((ban: any) => ban.userId));
            const filteredUsers = data.users.filter((user: any) => !alreadyBannedUserIds.includes(user._id));
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

        // Call fetchUsers when the component mounts
    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    if (loading) {
        return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
    }
    if (!user?.IsAdmin) return <Redirect href="/main/home" />;



    
    const handleBanUser = (name: string, id: string) => {
        // TODO: Implement ban user logic
        console.log(`Ban user: ${name}`);
        setShowUserToBan(id); // Show confirmation dialog for the selected user
    };

    const handleConfirmBan = async (key: string, violation: string, banDuration: number) => {
        try {
            const response = await fetch(
                `https://localbites-4m9e.onrender.com/Admin/ban_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: key, reason: violation, duration: banDuration }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(`User ${key} has been banned.`);
                fetchUsers(); // Refresh the user list after banning
            } else {
                alert(`Failed to ban user ${key}: ${data.message}`);
            }
        }
        catch (error) {
            console.error(`Error banning user ${key}:`, error);
            alert(`An error occurred while banning user ${key}. Please try again.`);
        }
    };

    const handleCancelBan = () => {
        console.log("Ban cancelled");
        setShowUserToBan(null);

    };

     // Confirmation dialog for banning a user
     if (showUserToBan) {
        const key = showUserToBan; // Store the username of the user to be banned
        const user = users.find((u) => u._id === key)?.Username || "the user"; // Find the username based on the user ID
        return (
            <ScrollView style={{ flex: 1, padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Confirm Ban</Text>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>Are you sure you want to ban {user}?</Text>
                    <View style={{ marginBottom: 20 }}>
                    <Text style={{ marginBottom: 10 }}>Please provide a reason for the ban:</Text>
                    <TextInput
                                    style={{ marginTop: 15, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }}
                                    value={violation}
                                    onChangeText={setViolation}
                                    maxLength={240}
                                    multiline
                                />
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <Text style={{ marginBottom: 10 }}>Please provide a duration for the ban (days):</Text>
                    <TextInput placeholder="Ban duration (hours)" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginRight: 10 }} keyboardType="numeric" onChangeText={(text) => setBanDuration(parseInt(text)||0)} />
                    </View>

                    <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginRight: 10 }} onPress={() => handleConfirmBan(key, violation, banDuration)}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Yes, Ban User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'gray', padding: 10, borderRadius: 5 }} onPress={handleCancelBan}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>No, Cancel</Text>
                    </TouchableOpacity>
                
            </ScrollView>
        );
    }


    

    return (
        <View>
            <ScrollView style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Ban User</Text>
                <Text style={{ marginTop: 20 }}>This is where you can ban a user. You can select a user from the list of users and confirm the ban action.</Text>
                {users.map((user) => (
                    <View key={user._id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 }} onPress={() => handleBanUser(user.Username, user._id)}>
                            <MaterialCommunityIcons name="account-cancel" size={40} color="white" />
                            <Text style={{ fontSize: 18 , color: 'white' }}>{user.Username}</Text>
                            <Text style={{ color: 'white' }}>{user.Email}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
