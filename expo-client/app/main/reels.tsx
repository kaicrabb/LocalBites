import React, { useState, useEffect } from 'react';
import { Button, View, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { storage, auth } from '../../config/firebaseConfig';
import * as SecureStore from 'expo-secure-store';
import { onAuthStateChanged, User } from 'firebase/auth';




export default function Reels() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>("0");
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); // always start as true

  useEffect(() => { // listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false); // done loading
      if (firebaseUser) console.log("Firebase user ready:", firebaseUser.uid);
      else console.log("No Firebase user signed in yet");
    });

    return () => unsubscribe();
  }, []);
  

  const pickAndUploadVideo = async () : Promise<void>=> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      Alert.alert('No video selected');
      return;
    }

    const videoUri = result.assets[0].uri;
    setUploading(true);

    try {
      try{
        if (!user) {
          console.error("Firebase user not signed in yet");
          // should probably show a loading indicator or something
        } else {
          // we have the user, let's upload the video
          const user_id = user.uid;
          console.log("Logged in Firebase UID:", user_id);
 
          const response = await fetch(videoUri);
          const blob = await response.blob();
          const storageRef = ref(storage, `reels/${user_id}/${Date.now()}_${videoUri.split('/').pop()}`);
          const uploadTask = uploadBytesResumable(storageRef, blob);

          // Listen for state changes, errors, and completion of the upload.
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
              setDownloadURL(url);
              setUploading(false);
              Alert.alert('Upload successful', 'Your video has been uploaded!');
            }
          );}
                    }
          catch (error) {
              Alert.alert('Error', 'Failed to retrieve user information');
              setUploading(false);
              return;
          }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while uploading the video');
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loadingUser && (
        <Text style={{ marginBottom: 10, fontStyle: 'italic', color: 'gray' }}>
          Connecting to Reels User Storage...
        </Text>
      )}
      <Button title="Pick and Upload Video" onPress={pickAndUploadVideo} disabled={uploading || loadingUser} />
      {uploading && <Text>Uploading: {progress}%</Text>}
      {downloadURL && (
        <View style={{ marginTop: 20 }}>
          <Text>Download URL:</Text>
          <Text style={{ color: 'blue' }}>{downloadURL}</Text>
        </View>
      )}
    </View>
  );
}