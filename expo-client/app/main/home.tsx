import React, { useEffect, useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { auth} from '../../config/firebaseConfig';
import { signInWithCustomToken } from 'firebase/auth';

const INITIAL_REGION = {
  latitude: 40.3589695,
  longitude: -94.8831951,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function App() {
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const initFirebaseUser = async () => {
      const firebaseToken = await SecureStore.getItemAsync('firebaseToken');

      if (firebaseToken) {
        try {
          await signInWithCustomToken(auth, firebaseToken);
          console.log('Firebase user signed in from token');
        } catch (err) {
          console.error('Failed to sign in with Firebase token', err);
        }
      }

      setLoadingUser(false); // done loading
    };

    initFirebaseUser();
  }, []);
  if (loadingUser) return <Text style={{textAlign: 'center', fontSize: 16}}>Connecting to Firebase...</Text>;

  return <HomeScreen />;
}

function HomeScreen() {
  const mapRef = useRef<MapView>(null);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10 }}>
            <Text>Focus Map</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);

  const focusMap = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView 
      style={StyleSheet.absoluteFill} 
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      showsUserLocation
      showsMyLocationButton
      ref={mapRef}
      />
    </View>
  );
}
