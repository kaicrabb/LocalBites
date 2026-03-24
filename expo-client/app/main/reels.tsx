import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { ResizeMode, Video, Audio } from 'expo-av';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';

const { height } = Dimensions.get('window');

export default function ReelFeed() {
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={{ height: height, width: '100%', backgroundColor: '#000' }}>
      <Video
        source={{ uri: item }}
        style={{ flex: 1 }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={index === currentIndex} // ✅ only active video plays
        isLooping
        isMuted={false}
        volume={1.0}
        useNativeControls={false}
      />
    </View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      pagingEnabled
      snapToInterval={height}              // ✅ full screen snapping
      snapToAlignment="start"
      decelerationRate="fast"              // ✅ smooth fast swipe
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.y / height
        );
        setCurrentIndex(index);
      }}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
}