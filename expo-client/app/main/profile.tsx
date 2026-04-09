import { useRouter, useNavigation} from "expo-router";
import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from "react-native";
=======
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";
>>>>>>> ce4027b (I think I got it working #2)
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from "expo-av";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import * as SecureStore from 'expo-secure-store';
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
  const [userFirebase, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [user, setUserprofile] = useState<UserProfile>({
    username: "username",
    bio: "Big Back Reviews",
    profilePic: "placeholder.jpg",
  });
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "reviews">("videos");
  const [userVideos, setUserVideos] = useState<string[]>([]);
  const reviews = Array.from({ length: 6 }, (_, i) => `Review ${i + 1}`);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.push('../settings')}>
          <View style={{ padding: 10 }}>
            <Ionicons name="settings" size={24} />
          </View>
        </TouchableOpacity>
      )
    });
  }, [navigation, router]);

  useEffect(() => {
<<<<<<< HEAD
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
  });

  return () => unsubscribe();
}, []);

  const [userFirebase, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "reviews">("videos");
  const [userVideos, setUserVideos] = useState<string[]>([]);
  const [profileReviews, setProfileReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
=======
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);
>>>>>>> a6d8927 (I tried)

  useEffect(() => {
    if (!userFirebase) return;

    const fetchProfileImage = async () => {
      const user_id = userFirebase.uid;
      const profilePicRef = ref(storage, `profile/${user_id}`);

      try {
        const url = await getDownloadURL(profilePicRef);
        setSelectedImage(url);
      } catch (error) {
        console.log('No profile image found in storage, showing default.');
      }
    };

    fetchProfileImage();
  }, [userFirebase]);

<<<<<<< HEAD
    setUserVideos(urls.reverse());
  };
=======
  useEffect(() => {
    if (!userFirebase) return;
>>>>>>> a6d8927 (I tried)

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

  useEffect(() => {
    const fetchProfileReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      setProfileReviews([]);

      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          setReviewsError('You must be logged in to view your reviews.');
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
        if (!userInfo.user._id) {
          setReviewsError('Unable to load user information.');
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
        if (!reviewsResponse.ok) {
          setReviewsError(reviewsData.message || 'Unable to load reviews.');
          return;
        }

        setProfileReviews(Array.isArray(reviewsData.reviews) ? reviewsData.reviews : []);
      } catch (error) {
        console.error('Error fetching profile reviews:', error);
        setReviewsError('Unable to load reviews.');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProfileReviews();
  }, [userFirebase]);

  const handleDeleteReview = async (reviewId: string) => {
    Alert.alert('Delete review', 'Do you want to delete this review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
              Alert.alert('Unauthorized', 'Please log in to delete reviews.');
              return;
            }

            const res = await fetch('https://localbites-4m9e.onrender.com/reviews/delete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ reviewId }),
            });

            const data = await res.json();
            if (!res.ok) {
              Alert.alert('Error', data?.message || 'Failed to delete review.');
              return;
            }

            setProfileReviews((prev) => prev.filter((r) => r._id !== reviewId));
            Alert.alert('Deleted', 'Your review has been deleted.');
          } catch (err) {
            console.error('Delete review error', err);
            Alert.alert('Error', 'Unable to delete review at this time.');
          }
        },
      },
    ]);
  };

  const renderReviewsTab = () => {
    if (reviewsLoading) {
      return (
        <View style={styles.reviewPlaceholder}>
          <Text style={{ color: 'gray' }}>Loading your reviews...</Text>
        </View>
      );
    }

    if (reviewsError) {
      return (
        <View style={styles.reviewPlaceholder}>
          <Text style={{ color: 'red' }}>{reviewsError}</Text>
        </View>
      );
    }

    if (profileReviews.length === 0) {
      return (
        <View style={styles.reviewPlaceholder}>
          <Text style={{ color: 'gray' }}>You have not left any reviews yet.</Text>
        </View>
      );
    }

    return profileReviews.map((review) => (
      <View key={review._id} style={styles.reviewTile}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>
            {review.Place?.displayName || 'Unknown Place'}
          </Text>
          <TouchableOpacity onPress={() => handleDeleteReview(review._id)}>
            <Ionicons name="trash" size={20} color="#d9534f" />
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewRating}>
          {Array.from({ length: 5 }, (_, index) => (
            <Text key={index} style={{ color: index < review.Rating ? '#FFD700' : '#ccc' }}>
              ★
            </Text>
          ))}
        </Text>
        <Text style={styles.reviewComment}>{review.Comment || 'No comment provided.'}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <ImageViewer 
            imgSource={require('../../assets/images/default.jpg')} 
            selectedImage={selectedImage} 
          />
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
        {activeTab === "videos" ?  
          (userVideos.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.videoTile}
              onPress={() =>
                router.push({
                  pathname: "/main/video/[videoURL]",
                  params: { videoURL: encodeURIComponent(item) },
                })
              }
            >
              <Video
                source={{ uri: item }}
                style={{ width: "100%", height: "100%" }}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isMuted
                isLooping
              />
            </TouchableOpacity>
          ))
        ) : (
          renderReviewsTab()
        )}
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
  reviewPlaceholder: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  reviewTile: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    marginBottom: 12,
  },
  reviewTitle: {
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 16,
  },
  reviewRating: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewComment: {
    color: "#444",
    fontSize: 14,
  },
    reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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