import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react'; 
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';


export default function ChangePassword() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if(!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (newPassword === currentPassword) {
            Alert.alert('Error', 'New password should not be the same as current password');
            return;
        }
        try{
            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                Alert.alert('Error', 'Token not found. Please log in again.');
                router.replace('/login');
                return;
            }

            const response = await fetch ('https://localbites-4m9e.onrender.com/Authentication/change_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else{
                Alert.alert('Error', data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
            Alert.alert('Error', 'An error occurred while changing password');
        }
    };
    
    return (
        <View style={styles.container}>
                <Text style={styles.title}>Change Password</Text>
                <TextInput
                    placeholder='Current Password'
                    placeholderTextColor="#000000"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    placeholder='New Password'
                    placeholderTextColor="#000000"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    placeholder='Confirm New Password'
                    placeholderTextColor="#000000"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    const styles = StyleSheet.create({
      container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, marginBottom: 20 },
      title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
      input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 12 },
      button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 30 },
      buttonText: { color: "#fff", fontWeight: "bold" },
      link: { color: "#007AFF", marginTop: 8 }
    });