import React, { useEffect, useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { auth} from '../../config/firebaseConfig';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

const INITIAL_REGION = {
  latitude: 40.3589695,
  longitude: -94.8831951,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function App() {
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log('Firebase user already signed in:', user.uid);
          setLoadingUser(false);
          return;
        }

        console.log('No Firebase user, requesting new custom token');

        const backendToken = await SecureStore.getItemAsync('token');

        if (!backendToken) {
          throw new Error('No backend token found');
        }

        const response = await fetch(
          'https://localbites-4m9e.onrender.com/Authentication/firebase_token',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${backendToken}`,
            },
          }
        );

        const data = await response.json();

        if (!data.firebaseToken) {
          throw new Error('No firebaseToken returned from backend');
        }

        await signInWithCustomToken(auth, data.firebaseToken);

        console.log('Signed in with new custom token');
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }

      setLoadingUser(false);
    });

    return unsubscribe;
  }, []);

  if (loadingUser) {
    return (
      <Text style={{ textAlign: 'center', fontSize: 16 }}>
        Connecting to Firebase...
      </Text>
    );
  }

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

  const mapStyle = [
  {
    "featureType": "poi.business",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  ];

  return (
    
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      customMapStyle={mapStyle}
      showsUserLocation
      showsMyLocationButton
      ref={mapRef}
      />
    </View>
  );
}
