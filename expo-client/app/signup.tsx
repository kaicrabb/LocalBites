import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';       
import { useState } from 'react';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleLogin = async () => {
        if(!email || !password || !username) {
            Alert.alert('Error', 'Please sign up with username, email, and password');
            return;
        }
        
        try{
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

        const data = await response.json();

        if(response.ok) {
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
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.link}>Already have an account? Sign in then!</Text>
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
