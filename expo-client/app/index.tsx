import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRouter } from 'expo-router';

export default function SignUpLogin() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <Text style={styles.title}>LocalBites</Text>
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
    fontSize: 36,
    marginBottom: 40,
    fontWeight: "bold",
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
});