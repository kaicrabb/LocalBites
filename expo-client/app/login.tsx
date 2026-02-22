import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';       
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
// Correct way to import
import { auth } from "../config/firebaseConfig"; // Get your unique 'auth' instance
import { signInWithCustomToken, Auth } from "firebase/auth"; // Get the FUNCTION from the library

export default function Login() {
    const router = useRouter();
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');

    const handleLogin = async () => {
        if(!Email || !Password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }
        
        try{
            const response = await fetch('https://localbites-4m9e.onrender.com/Authentication/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email, Password }),
            });

        const data = await response.json();

        if(response.ok) {
            try{
                await signInWithCustomToken(auth as Auth, data.firebaseToken);
            } catch (error : any) {
                Alert.alert('Error', 'Failed to authenticate with Firebase');
                console.log("Error Code:", error.code);     // Look for this!
                console.log("Error Message:", error.message);
                return;
            }

            await SecureStore.setItemAsync("firebaseToken", data.firebaseToken);
            await SecureStore.setItemAsync("token", data.token);
            router.replace('/main/home');
        }
        else {
            Alert.alert('Login Failed', data.message || 'Invalid credentials');
        }
    }
        catch (error) {
            Alert.alert('Error', 'An error occurred during login');
        }
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder='Email'
                placeholderTextColor="#000000"
                value={Email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder='Password'
                placeholderTextColor="#000000"
                value={Password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#007AFF", marginTop: 8 }
});
