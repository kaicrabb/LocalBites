import {View, Text} from 'react-native';

export default function ViewUsers() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>View Users</Text>
            <Text style={{ marginTop: 20 }}>This is where you can view all users, including their profiles and activity. You can also search for specific users and view their details.</Text>
        </View>
    );
}