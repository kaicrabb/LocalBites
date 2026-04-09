import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useRouter } from 'expo-router';      
import Button from './Button';
import ImageViewer from './ImageViewer';  
import * as SecureStore from 'expo-secure-store'; 
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const PlaceholderImage = require ('@/assets/images/default.jpg');



export default function App() {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    router.replace("/");
  };

  const handleDeleteAccount = async (): Promise<void> => {
    router.replace("/deleteAccount");
  };

  const handleChangePassword = () => {
    router.push('/changePassword'); 
  };

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log('No image selected.');  
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

