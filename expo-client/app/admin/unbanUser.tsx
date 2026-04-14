import { View, Text } from "react-native";

export default function UnbanUser() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Unban User</Text>
            <Text style={{ marginTop: 20 }}>This is where you can unban a user. You can select a user from the list of banned users and confirm the unban action.</Text>
        </View>
    );
}