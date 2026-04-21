import { useRouter, useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from "expo-av";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../../config/firebaseConfig";
import { onAuthStateChanged, User } from 'firebase/auth';
import ImageViewer from '../ImageViewer';

interface UserProfile {
  username: string;
  bio: string;
  profilePic: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  
  // State Management
  const [userFirebase, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: "username",
    bio: "Big Back Reviews",
    profilePic: "placeholder.jpg",
  });
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "reviews">("videos");
  const [userVideos, setUserVideos] = useState<string[]>([]);
  
  // Placeholder for your backend reviews logic
  const [userReviews, setUserReviews] = useState<string[]>(Array.from({ length: 6 }, (_, i) => `Review ${i + 1}`));

  // 1. Navigation Header Setup
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.push('../settings')}>
          <View style={{ padding: 10 }}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </View>
        </TouchableOpacity>
      ),
      headerTitle: "Profile"
    });
  }, [navigation, router]);

  // 2. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // 3. Fetch Data from Firebase
  useEffect(() => {
    if (!userFirebase) return;

    const fetchUserContent = async () => {
      const user_id = userFirebase.uid;
      
      try {
        // Fetch Profile Image
        const profilePicRef = ref(storage, `profile/${user_id}`);
        const picUrl = await getDownloadURL(profilePicRef);
        setSelectedImage(picUrl);

        // Fetch User Reels/Videos
        const reelsRef = ref(storage, `reels/${user_id}`);
        const result = await listAll(reelsRef);
        const videoUrls = await Promise.all(
          result.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setUserVideos(videoUrls);
      } catch (error) {
        console.log('Error fetching user content:', error);
      }
    };

    fetchUserContent();
  }, [userFirebase]);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <ImageViewer 
            imgSource={require('../../assets/images/default.jpg')} 
            selectedImage={selectedImage} 
          />
        </View>
        <Text style={styles.usernameText}>@{userProfile.username}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>4.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>15K</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        <Text style={styles.bio}>{userProfile.bio}</Text>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "videos" && styles.activeTab]}
          onPress={() => setActiveTab("videos")}
        >
          <Ionicons name="videocam-outline" size={20} color={activeTab === "videos" ? "black" : "gray"} />
          <Text style={{ color: activeTab === "videos" ? "black" : "gray" }}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
          onPress={() => setActiveTab("reviews")}
        >
          <Ionicons name="star-outline" size={20} color={activeTab === "reviews" ? "black" : "gray"} />
          <Text style={{ color: activeTab === "reviews" ? "black" : "gray" }}>Reviews</Text>
        </TouchableOpacity>
      </View>

      {/* Content Grid */}
      <View style={styles.grid}>
        {(activeTab === "videos" ? userVideos : userReviews).map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.gridTile}
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
                style={StyleSheet.absoluteFill}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isMuted
              />
            ) : (
              <View style={styles.reviewPlaceholder}>
                <Text style={styles.reviewText}>{item}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Edit Modal Overlay */}
      {editing && (
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={userProfile.username}
              onChangeText={(text) => setUserProfile({ ...userProfile, username: text })}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Bio"
              multiline
              value={userProfile.bio}
              onChangeText={(text) => setUserProfile({ ...userProfile, bio: text })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={() => setEditing(false)}>
                <Text style={{ color: "white" }}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setEditing(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileHeader: { alignItems: "center", paddingTop: 100, paddingBottom: 20 },
  imageContainer: { marginBottom: 15 },
  usernameText: { fontWeight: "bold", fontSize: 20, marginBottom: 10 },
  stats: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginVertical: 15 },
  stat: { alignItems: "center" },
  statNumber: { fontWeight: "bold", fontSize: 16 },
  statLabel: { color: "gray", fontSize: 12 },
  editBtn: { marginVertical: 10, paddingVertical: 10, paddingHorizontal: 40, borderWidth: 1, borderColor: '#ddd', borderRadius: 5 },
  editBtnText: { fontWeight: '600' },
  bio: { paddingHorizontal: 30, color: "#444", textAlign: "center", fontSize: 14 },
  tabs: { flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#eee", marginTop: 20 },
  tab: { flex: 1, padding: 12, alignItems: "center", flexDirection: 'row', justifyContent: 'center', gap: 5 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "black" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  gridTile: { width: "33.3%", aspectRatio: 1, backgroundColor: "#f0f0f0", borderWidth: 0.5, borderColor: '#fff' },
  reviewPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 },
  reviewText: { fontSize: 10, textAlign: 'center' },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  editModal: { backgroundColor: "#fff", padding: 25, borderRadius: 15, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#eee", borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#fafafa' },
  modalActions: { gap: 10 },
  actionBtn: { padding: 12, alignItems: 'center', borderRadius: 8 },
  saveBtn: { backgroundColor: '#000' },
});

export default ProfilePage;