import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { ResizeMode, Video, Audio } from 'expo-av';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function ReelFeed() {
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pausedIndex, setPausedIndex] = useState<number | null>(null);

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
      try {
        const reelsRef = ref(storage, 'reels/');
        const result = await listAll(reelsRef);

        const urls = await Promise.all(
          result.items.map(itemRef => getDownloadURL(itemRef))
        );

        setVideos(urls);
      } catch (error) {
        console.log('Error fetching reels:', error);
      }
    };

    setupAudio();
    fetchVideos();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      videoRefs.current.forEach((video) => {
        video?.pauseAsync();
      });
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
    if (nextVideo) {
      nextVideo.loadAsync(
        { uri: videos[currentIndex + 1] },
        {},
        false
      );
    }
  }, [currentIndex, pausedIndex, isFocused]);

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
        const index = Math.round(
          event.nativeEvent.contentOffset.y / height
        );
        setCurrentIndex(index);
        setPausedIndex(null); // reset pause on scroll
      }}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
}