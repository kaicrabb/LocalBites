import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import * as secureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BanUser() {
    const [users, setUsers] = useState<any[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [showUserToBan, setShowUserToBan] = useState<string | null>(null);

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
            const isAdmin = await secureStore.getItemAsync('isAdmin');
            const convertedIsAdmin = isAdmin === 'true'; // Convert string to boolean
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

    const handleBanUser = (key: string) => {
        // TODO: Implement ban user logic
        return (<View><Text>Are you sure you wish to ban <b>{key}</b>?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                    <TouchableOpacity onPress={() => handleConfirmBan(key)}>
                        <Text>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancelBan}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>);
    };

    const handleConfirmBan = async (key: string) => {
        try {
            const response = await fetch(
                `https://localbites-4m9e.onrender.com/Admin/ban_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ Username: key }),
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
        // return to list by just closing the confirmation dialog
        // This would typically involve setting a state variable to hide the dialog

    };

    return (
        <View>
            <ScrollView style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Ban User</Text>
                <Text style={{ marginTop: 20 }}>This is where you can ban a user. You can select a user from the list of users and confirm the ban action.</Text>
                {users.map((user) => (
                    <View key={user._id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 }} onPress={() => handleBanUser(user.Username)}>
                            <MaterialCommunityIcons name="account-cancel" size={40} color="white" />
                            <Text style={{ fontSize: 18 }}>{user.Username}</Text>
                            <Text style={{ color: 'gray' }}>{user.Email}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
