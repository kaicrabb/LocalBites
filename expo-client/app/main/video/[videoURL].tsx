import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";
import { Text } from "react-native";

export default function VideoPlayer() {
  const { videoUrl } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: decodeURIComponent(videoUrl as string) }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
      />

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ color: "white", fontSize: 18 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
  },
});