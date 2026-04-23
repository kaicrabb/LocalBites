/*
    * This file defines the React Native component for the "Delete User Account" screen in the admin section of the LocalBites app.
    * It allows admins to view a list of all users and delete user accounts as needed.
    * The component fetches the list of users from the server when it mounts and displays them in a scrollable view.
    * Each user entry includes a "Delete User" button that triggers a confirmation prompt before sending a request to the server to delete the user account.
    * The component also checks if the current user is an admin and redirects non-admin users back to the home screen.
*/
import {ScrollView, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { useState, useEffect } from 'react';
import * as secureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useUserInfo from '../fetchuser';
import { Redirect } from 'expo-router';

export default function DeleteUserAccount() {
    const [users, setUsers] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const { user, loading } = useUserInfo();
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
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
            setUsers(data.users);
        }
        catch (error) {
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


    const handleconfirmDelete = (userId: string) => {
        console.log(`Confirm delete for user ID: ${userId}`);
        // Show a confirmation prompt before deleting the user by opening a confirmation form
        setUserToDelete(userId); // Set the user ID to be deleted in the state to show the confirmation form
    };

    const handleCancelDelete = () => {
        console.log("Cancel delete");
        setUserToDelete(null); // Close the confirmation form
    };

    const handledeleteUser = (userId: string) => {
        console.log(`Delete User confirmed for user ID: ${userId}`);
        // Implement the logic to delete the user account using the userId
        const deleteUser = async () => {
            try {
                const response = await fetch(`https://localbites-4m9e.onrender.com/Admin/delete_user_account`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId }),
                });
                if (response.ok) {
                    console.log(`User with ID: ${userId} deleted successfully`);
                    // Refresh the user list after deletion
                    fetchUsers();
                }
                else {
                    console.error(`Failed to delete user with ID: ${userId}`, await response.text());
                }
            }
            catch (error) {
                console.error(`Error deleting user with ID: ${userId}`, error);
            }
        };
        deleteUser();
        setUserToDelete(null); // Close the confirmation form after deletion
    };

    if (userToDelete) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>Are you sure you want to delete this user account?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%' }}>
                    <TouchableOpacity style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, alignItems: 'center', flex: 1, marginRight: 10 }} onPress={() => handledeleteUser(userToDelete)}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Yes, Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10, backgroundColor: 'gray', borderRadius: 5, alignItems: 'center', flex: 1, marginLeft: 10 }} onPress={handleCancelDelete}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>No, Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const filteredUsers = users.filter((user: any) =>
        user.Username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <View style={{paddingBottom:90}}>
            <Text style={{marginTop:15, fontWeight:'700'}}>Search by Username</Text>
            <TextInput
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                }}
            />
        <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Delete User Account</Text>
            {filteredUsers.map((user) => (
                <View key={user._id} style={{ marginBottom: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5,  alignContent: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ccc', width: '90%' }}>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{user.Username}</Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', color: '#333' }}>{user.Email}</Text>
                    <TouchableOpacity style={{ marginTop: 10, padding: 10, backgroundColor: 'red', borderRadius: 5, alignItems: 'center' }} onPress={() => handleconfirmDelete(user._id)}>
                        <MaterialCommunityIcons name="account-cancel" size={20} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete User</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
        </View>
    );
}