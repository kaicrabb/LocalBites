import { useRouter, useNavigation} from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from "expo-av";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../../config/firebaseConfig";
import { onAuthStateChanged, User } from 'firebase/auth';
import ImageViewer from '../ImageViewer';
import * as SecureStore from 'expo-secure-store';


const PlaceholderImage = require('@/assets/images/default.jpg');

interface UserProfile {
  username: string;
  bio: string;
  profilePic: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const [user, setUserprofile] = useState<UserProfile>({
    username: "username",
    bio: "Big Back Reviews",
    profilePic: "placeholder.jpg",
  });
  const navigation = useNavigation();
    useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.push('../settings')}>
          <View style={{ padding: 10 }}>
            <Ionicons name="settings" size={24} />
          </View>
        </TouchableOpacity>
      )})})

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
  });

  return () => unsubscribe();
}, []);

  const [userFirebase, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "reviews">("videos");
  const [userVideos, setUserVideos] = useState<string[]>([]);
  const reviews = Array.from({ length: 6 }, (_, i) => `Review ${i + 1}`);

  useEffect(() => {
  if (!userFirebase) return;

  const fetchUserVideos = async () => {
    const user_id = userFirebase.uid;

    const reelsRef = ref(storage, `reels/${user_id}`);
    const result = await listAll(reelsRef);

    const urls = await Promise.all(
      result.items.map((itemRef) => getDownloadURL(itemRef))
    );

    setUserVideos(urls);
  };

  fetchUserVideos();
}, [userFirebase]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <ImageViewer imgSource={PlaceholderImage} />
        </View>
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
        <TouchableOpacity
          style={[styles.tab, activeTab === "videos" && styles.activeTab]}
          onPress={() => setActiveTab("videos")}
        >
          <Text>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
          onPress={() => setActiveTab("reviews")}
        >
          <Text>Reviews</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoGrid}>
        {(activeTab === "videos" ? userVideos : reviews).map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.videoTile}
            onPress={() =>
              router.push({
                pathname: "/main/video/[videoURL]",
                params: { videoURL: encodeURIComponent(item) },
              })
            }
          >
            {activeTab === "videos" ? (
              <Video
                source={{ uri: item }}
                style={{ width: "100%", height: "100%" }}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isMuted
                isLooping
              />
            ) : (
              <Text>{item}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {editing && (
        <View style={styles.editModal}>
          <Text>Edit Profile</Text>

          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={(text) => setUserprofile({ ...user, username: text })}
          />

          <TextInput
            style={styles.input}
            value={user.bio}
            onChangeText={(text) => setUserprofile({ ...user, bio: text })}
          />


          <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(false)}>
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
  imageContainer: { alignItems: "center", marginTop: -80 },
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
  videoTile: {
    width: "33%",
    aspectRatio: 9 / 16,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  editModal: {
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
});

export default ProfilePage;