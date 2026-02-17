import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useRouter } from 'expo-router';      
import Button from '../Button';
import ImageViewer from '../ImageViewer';  
import * as SecureStore from 'expo-secure-store'; 
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const PlaceholderImage = require ('@/assets/images/android-icon-background.png');



export default function App() {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/");
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
      alert('You did not select any image.');
    }
  };

  return (
    <View style = {Styles.container}>
      <View style = {Styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      <View style={Styles.footerContainer}>
        <Button theme='primary' label='Choose a photo' onPress={pickImageAsync} />
        <Button label='Use this photo' />
      </View>
      <View>
      <TouchableOpacity style={Styles.logoutButton} onPress={handleLogout}>
        <Text style={Styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1, 
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});

