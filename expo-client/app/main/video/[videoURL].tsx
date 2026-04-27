import { useLocalSearchParams } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function VideoPlayer() {
  const { videoURL } = useLocalSearchParams();
  const decodedUrl = videoURL as string;
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
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={48}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { width: "100%", height: "100%" },
  backBtn: { position: "absolute", top: 10, left: 20, zIndex:10 },
});