import React, { useState } from 'react';
import { Button, View, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { storage, auth } from '../../config/firebaseConfig';

export default function Reels() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>("0");
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const getBlobFromUri = async (uri: string): Promise<Blob> => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const pickAndUploadVideo = async () : Promise<void>=> {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to upload videos.");
      return;
    }
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
    setProgress("0");

    try {
      const blob = await getBlobFromUri(videoUri);
      const storageRef = ref(storage, `reels/${Date.now()}_${videoUri.split('/').pop()}`);
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