import { router, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import ImageViewer from '../ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

interface UserProfile {
  username: string;
  bio: string;
  profilePic: string;
}

const PlaceholderImage = require('../../assets/images/default.jpg');

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile>({
    username: "username",
    bio: "Big Back Reviews",
    profilePic: "placeholder.jpg",
  });

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "reviews">("videos");

  const videos = Array.from({ length: 9 }, (_, i) => `Video ${i + 1}`);
  const reviews = Array.from({ length: 6 }, (_, i) => `Review ${i + 1}`);

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

  useEffect(() => {
    const loadProfilePic = async () => {
      const pic = await SecureStore.getItemAsync("profilePic");
      if (pic) {
        setUser(prev => ({ ...prev, profilePic: pic }));
      }
    };
    loadProfilePic();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('../settings')}>
          <Ionicons name="settings" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <Image source={user.profilePic === "placeholder.jpg" ? PlaceholderImage : { uri: user.profilePic }} style={styles.profilePic} />
        <Text style={styles.usernameText}>@{user.username}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>120</Text>
            <Text>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>4.2K</Text>
            <Text>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>15K</Text>
            <Text>Likes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>

        <Text style={styles.bio}>{user.bio}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === "videos" && styles.activeTab]} onPress={() => setActiveTab("videos")}>
          <Text>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === "reviews" && styles.activeTab]} onPress={() => setActiveTab("reviews")}>
          <Text>Reviews</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoGrid}>
        {(activeTab === "videos" ? videos : reviews).map((item, i) => (
          <View key={i} style={styles.videoTile}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>

      {editing && (
        <View style={styles.editModal}>
          <Text>Edit Profile</Text>
          <TextInput style={styles.input} value={user.username} onChangeText={(text) => setUser({ ...user, username: text })} />
          <TextInput style={styles.input} value={user.bio} onChangeText={(text) => setUser({ ...user, bio: text })} />
          <TouchableOpacity style={styles.editBtn} onPress={pickImageAsync}>
            <Text>Pick Profile Picture</Text>
          </TouchableOpacity>
          {selectedImage && (
            <View style={styles.imageContainer}>
              <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
            </View>
          )}
          <TouchableOpacity style={styles.editBtn} onPress={async () => {
            const newPic = selectedImage || user.profilePic;
            setUser({ ...user, profilePic: newPic });
            await SecureStore.setItemAsync("profilePic", newPic);
            setSelectedImage(undefined);
            setEditing(false);
          }}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: { flexDirection: "row", justifyContent: "space-between", padding: 10 },
  settingsBtn: { fontSize: 20 },
  profileHeader: { alignItems: "center", padding: 20 },
  profilePic: { width: 110, height: 110, borderRadius: 55 },
  usernameText: { fontWeight: "bold", fontSize: 18, marginVertical: 5 },
  stats: { flexDirection: "row", justifyContent: "space-around", width: "80%", marginVertical: 10 },
  stat: { alignItems: "center" },
  statNumber: { fontWeight: "bold" },
  editBtn: { marginTop: 10, paddingVertical: 8, paddingHorizontal: 20, borderWidth: 1, borderRadius: 8 },
  bio: { marginTop: 10, color: "gray", textAlign: "center" },
  tabs: { flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#eee" },
  tab: { flex: 1, padding: 10, alignItems: "center" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "black" },
  videoGrid: { flexDirection: "row", flexWrap: "wrap" },
  videoTile: { width: "33%", aspectRatio: 9 / 16, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center" },
  editModal: { position: "absolute", top: "20%", left: "10%", right: "10%", backgroundColor: "#fff", padding: 20, borderRadius: 10, elevation: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 5, marginBottom: 10 },
  imageContainer: { alignItems: "center", marginVertical: 10 },
});

export default ProfilePage;