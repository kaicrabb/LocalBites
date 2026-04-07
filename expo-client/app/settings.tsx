import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useRouter } from 'expo-router';      
import Button from './Button';
import ImageViewer from './ImageViewer';  
import * as SecureStore from 'expo-secure-store'; 
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage, auth } from "../../config/firebaseConfig";
import { onAuthStateChanged, User } from 'firebase/auth';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const PlaceholderImage = require ('@/assets/images/default.jpg');



export default function App() {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/");
  };

  const handleDeleteAccount = async (): Promise<void> => {
    router.replace("/deleteAccount");
  };

  const handleChangePassword = () => {
    router.push('/changePassword'); 
  };

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const [userFirebase, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!userFirebase) return;

    const fetchProfileImage = async () => {
      const user_id = userFirebase.uid;
      const profilePicRef = ref(storage, `profile/${user_id}`);

      try {
        const url = await getDownloadURL(profilePicRef);
        setSelectedImage(url);
        await SecureStore.setItemAsync('profileImage', url);
      } catch (error) {
        const saved = await SecureStore.getItemAsync('profileImage');
        if (saved) setSelectedImage(saved);
        console.log('No profile image found in strorage yet.');
      }
    };

    fetchProfileImage();
  }, [userFirebase]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled && userFirebase) {
      const imageUri = result.assets[0].uri;
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profile/${userFirebase}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        setSelectedImage(url);
        await SecureStore.setItemAsync('profileImage', url);
        alert('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to update profile picture. Please try again.');
      }
    }
  };

  return (
  <View style={Styles.container}>
    
    <View style={Styles.imageContainer}>
      <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
    </View>

    <View style={Styles.photoButtonContainer}>
      <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
    </View>

    <View style={Styles.accountActions}>
      <TouchableOpacity style={Styles.logoutButton} onPress={handleLogout}>
        <Text style={Styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.logoutButton} onPress={handleDeleteAccount}>
        <Text style={Styles.logoutText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.changePasswordButton} onPress={handleChangePassword}>
        <Text style={Styles.logoutText}>Change Password</Text>
      </TouchableOpacity>
    </View>
    
  </View>
);
}

const Styles = StyleSheet.create({
  container: {
    flex: 1, // take full screen
    padding: 30,
    justifyContent: "space-evenly", // evenly distributes top/middle/bottom sections
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: -80,
  },
  photoButtonContainer: {
    flexDirection: "column",
    justifyContent: "space-between", // spreads buttons evenly in this section
    gap: 10, // spacing between buttons (RN >= 0.71)
    marginTop:-60,
  },
  accountActions: {
    flexDirection: "column",
    justifyContent: "space-between", // spreads account buttons evenly vertically
    gap: 10,
    marginTop: -90, // pull the whole block up (adjust value as needed)
  },
  logoutButton: {
    padding: 12,
    backgroundColor: "#f55",
    borderRadius: 8,
    alignItems: "center",
  },
  changePasswordButton: {
    padding: 12,
    backgroundColor: "#55f",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

