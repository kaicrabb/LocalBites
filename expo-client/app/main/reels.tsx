import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { ResizeMode, Video, Audio } from 'expo-av';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function ReelFeed() {
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isFocused = useIsFocused();
  const videoRefs = useRef<(Video | null)[]>([]);

  useEffect(() => {
    const setupAudio = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    };

    const fetchVideos = async () => {
      const reelsRef = ref(storage, 'reels/');
      const result = await listAll(reelsRef);

      const urls = await Promise.all(
        result.items.map((itemRef) => getDownloadURL(itemRef))
      );

      setVideos(urls);
    };

    setupAudio();
    fetchVideos();
  }, []);

  const handleScrollEnd = async (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / height);
    setCurrentIndex(index);

    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === index) {
        video.replayAsync(); // restart when active
      } else {
        video.pauseAsync(); // stop when off-screen
      }
    });
  };

  // Pause when leaving tab, resume when returning
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (!video) return;

    if (isFocused) {
      video.playAsync();
    } else {
      video.pauseAsync();
    }
  }, [isFocused, currentIndex]);

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={{ height, backgroundColor: '#000' }}>
      <Video
        ref={(ref) => {
          videoRefs.current[index] = ref;
        }}
        source={{ uri: item }}
        style={{ flex: 1 }}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={false}
        volume={1.0}
      />
    </View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(_, i) => i.toString()}
      pagingEnabled
      snapToInterval={height}
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={handleScrollEnd}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={3}
      removeClippedSubviews
    />
  );
}