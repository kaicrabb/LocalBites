import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';       
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {auth} from "../config/firebaseConfig";
import {signInWithCustomToken } from "firebase/auth";
import { fetchUserInfo } from './fetchuser';
import { LinearGradient } from 'expo-linear-gradient';

interface SignUpResponse {
  token: string;
  firebaseToken: string;
  message?: string;
}

export default function Signup() {
    const router = useRouter();
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Username, setUsername] = useState('');
    const {height} = useWindowDimensions();

    const handleSignUp = async () => {
        if(!Email || !Password || !Username) {
            Alert.alert('Error', 'Please sign up with username, email, and password');
            return;
        }
        
        try{
            const response = await fetch('https://localbites-4m9e.onrender.com/Authentication/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username, Email, Password }),
            });

        const data: SignUpResponse = await response.json();

        if(response.ok) {
            await SecureStore.setItemAsync("token", data.token);
            const userinfo = await fetchUserInfo();
            await SecureStore.setItemAsync("user", JSON.stringify(userinfo));
            await signInWithCustomToken(auth, data.firebaseToken);
            router.replace('/main/home');
        }
        else {
            Alert.alert('Sign Up Failed', data.message || 'Invalid credentials');
        }
    }
        catch (error) {
            Alert.alert('Error', 'An error occurred during sign up');
            console.log(error);
        }
        
    };

    return (
        <View style={styles.container}>
            <LinearGradient
          // Background Linear Gradient
          colors={['rgba(59, 211, 79, 0.8)', 'rgba(59, 181, 211, 0.8)']}
          style={[styles.background, {height}]}
        />
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                placeholder='Username'
                placeholderTextColor="#ffffff"
                value={Username}
                onChangeText={setUsername}
                style={styles.input}
            />
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
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.link}>Already have an account? Sign in then!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color:'white' },
  input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 12, color:'white'},
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
