import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';       
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { auth} from "../config/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";
import { fetchUserInfo } from './fetchuser';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
    const router = useRouter();
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const { height } = useWindowDimensions()

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
            await SecureStore.setItemAsync("token", data.token);
            const userInfo = await fetchUserInfo();
            await SecureStore.setItemAsync("user", JSON.stringify(userInfo));
            await signInWithCustomToken(auth, data.firebaseToken);
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
            <LinearGradient
                      // Background Linear Gradient
                      colors={['rgba(59, 211, 79, 0.8)', 'rgba(59, 181, 211, 0.8)']}
                      style={[styles.background, {height}]}
                    />
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder='Email'
                placeholderTextColor="#ffffff"
                value={Email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder='Password'
                placeholderTextColor="#ffffff"
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
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color:'white' },
  input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 12, color: 'white'},
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#007AFF", marginTop: 8 },
  background:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});
