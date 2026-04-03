import { useLocalSearchParams } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

export default function VideoPlayer() {
  const { videoURL } = useLocalSearchParams();
  const decodedUrl = decodeURIComponent(videoURL as string);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: decodedUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
      />

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/main/profile")}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { width: "100%", height: "100%" },
  backBtn: { position: "absolute", top: 50, left: 20 },
});