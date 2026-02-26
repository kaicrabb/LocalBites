import React, { useState } from 'react';
import { Button, View, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import * as SecureStore from 'expo-secure-store';

export default function Reels() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>("0");
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

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
                  const token = await SecureStore.getItemAsync("token");
                  const id_response = await fetch('https://localbites-4m9e.onrender.com/user_info', {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                      },
                      body: JSON.stringify({ }),
                  });
                  const data = await id_response.json();
                  if (!id_response.ok) {
                      throw new Error(data.message || 'Failed to retrieve user information');
                  }
                  const user_id = data.id;
                  const response = await fetch(videoUri);
                  const blob = await response.blob();
          const storageRef = ref(storage, `reels/${user_id}/${Date.now()}_${videoUri.split('/').pop()}`);
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
              setDownloadURL(url);
              setUploading(false);
              Alert.alert('Upload successful', 'Your video has been uploaded!');
            }
          );
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
      <Button title="Pick and Upload Video" onPress={pickAndUploadVideo} disabled={uploading} />
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