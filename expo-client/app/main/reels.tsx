import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { ResizeMode, Video, Audio } from 'expo-av';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import { useIsFocused } from '@react-navigation/native';
import useUserInfo from '../fetchuser';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const { height } = Dimensions.get('window');

export default function ReelFeed() {
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pausedIndex, setPausedIndex] = useState<number | null>(null);

  const isFocused = useIsFocused();
  const videoRefs = useRef<(Video | null)[]>([]);
  const { user, loading } = useUserInfo();
  const router = useRouter();

    if (loading && user === null) {
      delay(2000).then(() => {
        console.log("Loading user info...");
      });
      return null; // should make a loading screen here
    }
    if (!loading) {
      if (user?.isBanned) {// show message then log out user
        delay(3000).then(() => {
          console.log("Logging out banned user...");
          SecureStore.deleteItemAsync("token");
          SecureStore.deleteItemAsync("user");
          router.replace("/");
        });
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
              Your account has been banned. You will be logged out shortly.
            </Text>
          </View>
        );
      }
    }

  useEffect(() => {
    const setupAudio = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    };

    const fetchVideos = async () => {
      try {
        const reelsRef = ref(storage, 'reels/');
        const result = await listAll(reelsRef);

        const userFolders = result.prefixes;
        const allUrls: string[] = [];

        for (const folderRef of userFolders) {
          const folderResult = await listAll(folderRef);

          const urls = await Promise.all(
            folderResult.items.map((itemRef) => getDownloadURL(itemRef))
          );

          allUrls.push(...urls);
        }

        for (let i = allUrls.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allUrls[i], allUrls[j]] = [allUrls[j], allUrls[i]];
        }

        setVideos(allUrls);
      } catch (error) {
        console.log('Error fetching reels:', error);
      }
    };

    setupAudio();
    fetchVideos();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      videoRefs.current.forEach((video) => video?.pauseAsync());
    }
  }, [isFocused]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === currentIndex && isFocused && pausedIndex !== index) {
        video.playAsync();
      } else {
        video.pauseAsync();
      }

      if (Math.abs(index - currentIndex) > 1) {
        video.unloadAsync();
      }
    });

    const nextVideo = videoRefs.current[currentIndex + 1];
    if (nextVideo && videos[currentIndex + 1]) {
      nextVideo.loadAsync(
        { uri: videos[currentIndex + 1] },
        {},
        false
      );
    }
  }, [currentIndex, pausedIndex, isFocused, videos]);

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const handlePress = () => {
      setPausedIndex((prev) => (prev === index ? null : index));
    };

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={{ height: height, width: '100%', backgroundColor: '#000' }}>
          <Video
            ref={(ref) => {
              videoRefs.current[index] = ref;
            }}
            source={{ uri: item }}
            style={{ flex: 1 }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isLooping
            isMuted={false}
            volume={1.0}
            useNativeControls={false}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      pagingEnabled
      snapToInterval={height}
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / height);
        setCurrentIndex(index);
        setPausedIndex(null);
      }}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
}