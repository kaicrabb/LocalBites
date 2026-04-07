import React, { useState, useEffect } from 'react';
import { 
  Button, View, Alert, Text, TextInput, StyleSheet, 
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore'; 
import { storage, auth } from '../../config/firebaseConfig'; 
import { db } from '../../config/firebaseConfig';

export default function Reels() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>("0");
  const [caption, setCaption] = useState<string>(" ");
  const [restaurant, setRestaurant] = useState<string>(" ");

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const pickAndUploadVideo = async (): Promise<void> => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    const videoUri = result.assets[0].uri;
    setUploading(true);

    try {
      const response = await fetch(videoUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `reels/${user.uid}/${Date.now()}`);
      
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed',
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p.toFixed(0));
        },
        (error) => {
          Alert.alert('Upload failed', error.message);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          try {
            await addDoc(collection(db, "reels"), {
              userId: user.uid,
              videoUrl: url,
              caption: caption,
              restaurant: restaurant,
              createdAt: serverTimestamp(),
            });
            Alert.alert('Success', 'Reel posted!');
            setCaption("");
            setRestaurant("");
          } catch (e) {
            Alert.alert('Database Error', 'Failed to save info.');
          } finally {
            setUploading(false);
            setProgress("0");
          }
        }
      );
    } catch (error) {
      Alert.alert('Error', 'Upload failed');
      setUploading(false);
    }
  };

  return (
    // 2. KeyboardAvoidingView prevents the keyboard from covering inputs
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      {/* 3. ScrollView allows the user to move the screen up/down */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loadingUser ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.innerContainer}>
            <Text style={styles.header}>Create New Reel</Text>

            <Text style={{ marginBottom: 5, color: 'black' }}>
              Caption:
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Write a catchy caption..."
              value={caption}
              onChangeText={setCaption}
              multiline
              editable={!uploading}
            />

            <Text style={{ marginBottom: 10, color: 'black' }}>
              Select Restaurant: 
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Write a catchy caption..."
              value={restaurant}
              onChangeText={setRestaurant}
              multiline
              editable={!uploading}
            />

            <Button 
              title={uploading ? `Uploading... ${progress}%` : "Pick & Post Video"} 
              onPress={pickAndUploadVideo} 
              disabled={uploading} 
            />

            {uploading && (
              <Text style={{ marginTop: 10 }}>Progress: {progress}%</Text>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the scroll view takes up the full screen
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  innerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    minHeight: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
  },
});