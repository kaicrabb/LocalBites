import { View, Text } from 'react-native';
import useUserInfo  from "../fetchuser";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, Redirect } from "expo-router";

export default function ManageReviews() {
    const { user, loading } = useUserInfo();
    if (loading) {
            return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
        }
        if (!user?.IsAdmin) return <Redirect href="/main/home" />;
        else {
            console.log("User is admin:", user.IsAdmin, "User info:", user);
        }
        
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Manage Reviews</Text>
            <Text style={{ marginTop: 20 }}>This is where you can manage reviews, including deleting reviews, and viewing review details.</Text>
        </View>
    );
}
