import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';       
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function DeleteAccount() {
    const router = useRouter();
    const [password, setPassword] = useState('');

    const handleDeleteAccount = async () => {
        if(!password) {
            Alert.alert('Error', 'Please enter your password to delete your account');
            return;
        }
        try{
            const token = await SecureStore.getItemAsync("token");
            const response = await fetch('https://localbites-4m9e.onrender.com/Authentication/delete_account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ Password: password }),
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Account deleted successfully');
                await SecureStore.deleteItemAsync("token");
                router.push('/login');
            } else {
                Alert.alert('Error', data.message || 'Failed to delete account');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while deleting the account');
            console.log(error);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delete Account</Text>
            <TextInput
                placeholder='Enter your password to confirm'
                placeholderTextColor="#000000"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#007AFF", marginTop: 8 }
});
