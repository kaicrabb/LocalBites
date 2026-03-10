import { router, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";

interface UserProfile {
  username: string;
  bio: string;
  profilePic: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile>({
    username: "username",
    bio: "Big Back Reviews",
    profilePic: "placeholder.jpg",
  });

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "liked">("videos");

  const videos = Array.from({ length: 9 }, (_, i) => `Video ${i + 1}`);
  const liked = Array.from({ length: 6 }, (_, i) => `Liked ${i + 1}`);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('../settings')}>
          <Text style={styles.settingsBtn}>⚙</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
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
        <TouchableOpacity style={[styles.tab, activeTab === "liked" && styles.activeTab]} onPress={() => setActiveTab("liked")}>
          <Text>Liked</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoGrid}>
        {(activeTab === "videos" ? videos : liked).map((item, i) => (
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
          <TextInput style={styles.input} value={user.profilePic} onChangeText={(text) => setUser({ ...user, profilePic: text })} />

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
});

export default ProfilePage;