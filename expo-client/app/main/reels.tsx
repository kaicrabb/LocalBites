import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';

const { height } = Dimensions.get('window');

export default function ReelFeed() {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const reelsRef = ref(storage, 'reels/'); // adjust path as needed
      const result = await listAll(reelsRef);

      const urls = await Promise.all(result.items.map(itemRef => getDownloadURL(itemRef)));
      setVideos(urls);
    };

    fetchVideos();
  }, []);

  const renderItem = ({ item }: { item: string }) => (
    <View style={{ height, backgroundColor: '#000' }}>
      <Video
        source={{ uri: item }}
        style={{ flex: 1 }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        useNativeControls={false} 
        isMuted={false}            
        volume={1.0}
      />
    </View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      pagingEnabled
      showsVerticalScrollIndicator={false}
    />
  );
}