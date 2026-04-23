import { useRouter, useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from "expo-av";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import * as SecureStore from 'expo-secure-store';
import { storage, auth } from "../../config/firebaseConfig";
import { onAuthStateChanged, User } from 'firebase/auth';
import ImageViewer from '../ImageViewer';
import useUserInfo from "../fetchuser";

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
  const {user: userPull, loading} = useUserInfo();
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Unkown Username',
    bio: "Add a Bio!",
    profilePic: "placeholder.jpg",
  });
  useEffect(() => {
    if (userPull) {
      setUserProfile((prev) => ({
        ...prev,
        username: userPull.Username ?? prev.bio,
        bio: userPull.Bio ?? prev.bio,
      }));
    }
  }, [userPull]);
  
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "reviews">("videos");
  const [userVideos, setUserVideos] = useState<string[]>([]);
  
  // Reviews State
  const [profileReviews, setProfileReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

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

  // 3. Fetch Data from Firebase (Videos & Profile Pic)
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
        setUserVideos(videoUrls.reverse()); // Show newest first
      } catch (error) {
        console.log('Error fetching Firebase content:', error);
      }
    };

    fetchUserContent();
  }, [userFirebase]);

  // 4. Fetch Reviews from Custom Backend
  useEffect(() => {
    const fetchProfileReviews = async () => {
      if (!userFirebase) return;
      
      setReviewsLoading(true);
      setReviewsError(null);

      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          setReviewsError('Log in to view reviews.');
          return;
        }

        const userInfoResponse = await fetch('https://localbites-4m9e.onrender.com/user_info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const userInfo = await userInfoResponse.json();
        if (!userInfo.user?._id) {
          setReviewsError('Unable to load user ID.');
          return;
        }

        const reviewsResponse = await fetch(`https://localbites-4m9e.onrender.com/reviews?userId=${userInfo.user._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const reviewsData = await reviewsResponse.json();
        setProfileReviews(Array.isArray(reviewsData.reviews) ? reviewsData.reviews : []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewsError('Unable to load reviews.');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProfileReviews();
  }, [userFirebase]);
  
  if (loading) {
        return <View><MaterialCommunityIcons name="loading" size={20} /></View>; // Show a loading state while fetching user info
    }
  
  const handleDeleteReview = async (reviewId: string) => {
    Alert.alert('Delete review', 'Do you want to delete this review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync('token');
            const res = await fetch('https://localbites-4m9e.onrender.com/reviews/delete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ reviewId }),
            });

            if (res.ok) {
              setProfileReviews((prev) => prev.filter((r) => r._id !== reviewId));
              Alert.alert('Deleted', 'Your review has been removed.');
            }
          } catch (err) {
            Alert.alert('Error', 'Unable to delete review.');
          }
        },
      },
    ]);
  };

  const handleUpdateProfile = async ()=>{
    
    try{
      const token = await SecureStore.getItemAsync('token');
        const response = await fetch('https://localbites-4m9e.onrender.com/update_user_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            Username: userProfile.username,
            Bio: userProfile.bio,
          }),
        });
        const data = await response.json();
        if(response.ok) {
          setUserProfile((prev) => ({
            ...prev,
            username: data.user.Username,
            bio: data.user.Bio,
          }));

          Alert.alert("Success", "Profile updated!");
          setEditing(false);
        }else {
          Alert.alert("Error", data.message || "Update failed");
        }
    }
    catch(error){
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <ImageViewer 
            imgSource={require('../../assets/images/default.jpg')} 
            selectedImage={selectedImage} 
          />
        </View>
        <Text style={styles.usernameText}>@{userProfile.username}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statNumber}>120</Text><Text style={styles.statLabel}>Following</Text></View>
          <View style={styles.stat}><Text style={styles.statNumber}>4.2K</Text><Text style={styles.statLabel}>Followers</Text></View>
          <View style={styles.stat}><Text style={styles.statNumber}>15K</Text><Text style={styles.statLabel}>Likes</Text></View>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <Text style={styles.bio}>{userProfile.bio}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === "videos" && styles.activeTab]} onPress={() => setActiveTab("videos")}>
          <Ionicons name="videocam-outline" size={20} color={activeTab === "videos" ? "black" : "gray"} />
          <Text style={{ color: activeTab === "videos" ? "black" : "gray" }}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === "reviews" && styles.activeTab]} onPress={() => setActiveTab("reviews")}>
          <Ionicons name="star-outline" size={20} color={activeTab === "reviews" ? "black" : "gray"} />
          <Text style={{ color: activeTab === "reviews" ? "black" : "gray" }}>Reviews</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {activeTab === "videos" ? (
          userVideos.map((item, i) => (
            <TouchableOpacity key={i} style={styles.gridTile} onPress={() => router.push({ pathname: "/main/video/[videoURL]", params: { videoURL: encodeURIComponent(item) } })}>
              <Video source={{ uri: item }} style={{width: '100%', height: '100%'}} resizeMode={ResizeMode.COVER} isMuted />
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ width: '100%', padding: 10 }}>
            {reviewsLoading ? <Text>Loading...</Text> : 
             reviewsError ? <Text style={{color: 'red'}}>{reviewsError}</Text> :
             profileReviews.length === 0 ? <Text>No reviews yet.</Text> :
             profileReviews.map((review) => (
               <View key={review._id} style={styles.reviewTile}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.reviewTitle}>{review.Place?.displayName || 'Restaurant'}</Text>
                    <TouchableOpacity onPress={() => handleDeleteReview(review._id)}>
                      <Ionicons name="trash-outline" size={18} color="red" />
                    </TouchableOpacity>
                  </View>
                  <Text>{review.Comment}</Text>
               </View>
             ))
            }
          </View>
        )}
      </View>

      {editing && (
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TextInput style={styles.input} value={userProfile.username} onChangeText={(t) => setUserProfile({...userProfile, username: t})} />
            <TextInput style={styles.input} value={userProfile.bio} onChangeText={(t) => setUserProfile({...userProfile, bio: t})} />
            <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={handleUpdateProfile}>
              <Text style={{ color: "white" }}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileHeader: { alignItems: "center", paddingTop: 80, paddingBottom: 20 },
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
  gridTile: { width: "33.3%", aspectRatio: 1, backgroundColor: "#f0f0f0", borderWidth: 0.5, borderColor: '#fff', },
  reviewTile: { padding: 15, borderBottomWidth: 1, borderColor: '#eee', width: '100%' },
  reviewTitle: { fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  editModal: { backgroundColor: "#fff", padding: 25, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#eee", borderRadius: 8, padding: 12, marginBottom: 15 },
  actionBtn: { padding: 12, alignItems: 'center', borderRadius: 8 },
  saveBtn: { backgroundColor: '#000' },
});

export default ProfilePage;