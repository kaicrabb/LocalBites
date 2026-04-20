/*
    This file defines the ManageUsers component, which is an admin interface for managing user accounts. It allows admins to view user information, ban users, unban users, and delete user accounts. 
    The component checks if the current user is an admin before rendering the management options. Each option navigates to a different screen for performing the respective action.
*/

import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Redirect } from "expo-router";
import useUserInfo from '../fetchuser';


export default function ManageUsers() {
    const router = useRouter();
    const { user, loading } = useUserInfo();
    if (loading) {
            return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
        }
        if (!user?.IsAdmin) return <Redirect href="/main/home" />;
        else {
            console.log("User is admin:", user.IsAdmin, "User info:", user);
        }

    const handleViewUserInfo = () => {
        console.log("View User Info clicked");
        router.push("./viewUsers");
    }

    const handleBanUser = () => {
        console.log("Ban User clicked");
        router.push("./banUser");
    }

    const handleUnbanUser = () => {
        console.log("Unban User clicked");
        router.push('./unbanUser');
    }

    const handledeleteUser = () => {
        console.log("Delete User clicked");
        router.push('/admin/deleteUserAccount');
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Manage Users</Text>
            <Text style={{ marginTop: 20 }}>This is where you can manage user profiles, including banning users, unbanning users, and viewing user information.</Text>
            <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "blue", borderRadius: 5, alignItems: "center", width: '80%' }} onPress={handleViewUserInfo}>
                <MaterialCommunityIcons name="account-circle" size={40} color="white" />
                <Text style={{ color: "white", fontWeight: "bold" }}>View User Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "orange", borderRadius: 5, alignItems: "center", width: '80%' }} onPress={handleBanUser}>
                <MaterialCommunityIcons name="account-cancel" size={40} color="white" />
                <Text style={{ color: "white", fontWeight: "bold" }}>Ban User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "green", borderRadius: 5, alignItems: "center", width: '80%' }} onPress={handleUnbanUser}>
                <MaterialCommunityIcons name="account-check" size={40} color="white" />
                <Text style={{ color: "white", fontWeight: "bold" }}>Unban User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: "red", borderRadius: 5, alignItems: "center", width: '80%' }} onPress={handledeleteUser}>
                <MaterialCommunityIcons name="account-remove" size={40} color="white" />
                <Text style={{ color: "white", fontWeight: "bold" }}>Delete User</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
