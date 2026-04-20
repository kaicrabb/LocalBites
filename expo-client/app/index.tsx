import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {useEffect} from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';



export default function SignUpLogin() {
    const router = useRouter();
    const { height } = useWindowDimensions()
    
    useEffect(() => {
      const checkAuth = async () => {
        const token = await SecureStore.getItemAsync("token");

        if (token) {
          router.replace("/main/home");
        }
    };

    checkAuth();
    }, []);

    return (
        <View style={styles.container}>
          <LinearGradient
          // Background Linear Gradient
          colors={['rgba(59, 211, 79, 0.8)', 'rgba(59, 181, 211, 0.8)']}
          style={[styles.background, {height}]}
        />
        <View style={{justifyContent:'center', alignContent:'center', width:'80%' }}>
              <View style={styles.topContainer}>
                <Text style={styles.title}>LocalBites</Text>
                <FontAwesome5 name="drumstick-bite" size={40} color='white'/>
              </View>
              <View style={styles.middleContainer}>
                <TouchableOpacity 
                style={styles.button} 
                onPress={() => router.push('/login')}
                >
                <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={styles.button} 
                onPress={() => router.push('/signup')}
                >
                <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                </View>
            </View>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 40,
    marginBottom: 40,
    fontWeight: "bold",
  },
  background:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  button: {
    width: 200,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  signup: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  topContainer:{
    position: 'absolute',
    top: 80, 
    width: '100%',
    alignItems: 'center',
    flexDirection:'row',
    left:100
  },
  middleContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    top: 350,
    left: 35
  }
});