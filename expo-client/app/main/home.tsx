import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { auth} from '../../config/firebaseConfig';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CreateReview from '../review';


const INITIAL_REGION = {
  latitude: 40.3589695,
  longitude: -94.8831951,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
  radius: 20,
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
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurantData, setSelectedRestaurantData] = useState<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const setShowReviewFormFalse = () => {
    setShowReviewForm(false);
  }
  // Snap positions
  const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Sheet position:', index);
  }, []);
  const getNearbyRestaurants = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(
        `https://localbites-4m9e.onrender.com/Google_Api/nearby_restaurants?latitude=${INITIAL_REGION.latitude}&longitude=${INITIAL_REGION.longitude}&radius=${INITIAL_REGION.radius*1609}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // console.log('Raw nearby restaurants response:', data);
      setRestaurants(data);
      // console.log('Nearby restaurants:', data.restaurants);
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
    }
  };

  useEffect(() => {
    getNearbyRestaurants();
  }, []);

  const handlerestaurantPress = async (restaurantId: string) => {
    setShowReviewForm(false);
    const token = await SecureStore.getItemAsync('token');
      const response = await fetch(
        `https://localbites-4m9e.onrender.com/Google_Api/restaurant_details?placeId=${restaurantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // console.log('Restaurant details response:', data);
      
      setSelectedRestaurantData(data);
      bottomSheetRef.current?.snapToIndex(2);
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10 }}>
            <MaterialCommunityIcons name= 'home-map-marker' size={32}/>
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
    // Sets up home page view
    <View style={{ flex: 1 }}>
      {/* Setup the map and its markers */}
      <MapView style={StyleSheet.absoluteFillObject}
      
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      customMapStyle={mapStyle}
      showsUserLocation
      showsMyLocationButton
      ref={mapRef}
      >
      
      {Array.isArray(restaurants) &&
      restaurants.map((restaurant) => {

        // function for choosing what icon to use on map for that restaurant.
        const getRestaurantIcon = (primaryType: string) => {
          const lowerType = primaryType?.toLowerCase() || '';
          if (lowerType.includes('american_restaurant') || lowerType.includes('burger')) return 'hamburger';
          if (lowerType.includes('bar_and_grill')) return 'grill';
          if (lowerType.includes('japanese_restaurant') || lowerType.includes('sushi')) return 'noodles';
          if (lowerType.includes('pizza_delivery')) return 'pizza';
          if (lowerType.includes('italian_restaurant')) return 'pasta';
          if (lowerType.includes('mexican_restaurant')) return 'taco';
          if (lowerType.includes('chinese_restaurant')) return 'rice';
          if (lowerType.includes('steak_house')) return 'food-steak';
          if (lowerType.includes('asian_restaurant')) return 'noodles';
          if (lowerType.includes('buffet_restaurant')) return 'buffet';
          if (lowerType.includes('fast_food_restaurant')) return 'food';

          return 'food-fork-drink'; // default
        };
        return(
          //set marker information and create marker
        <Marker
          key={restaurant._id}
          coordinate={{
            latitude: restaurant.location.coordinates[1],
            longitude: restaurant.location.coordinates[0],
          }}
          
          title={restaurant.displayName}
          description={restaurant.formattedAddress}
          onPress={() => handlerestaurantPress(restaurant._id)}
        >
          <View style={{ position: 'relative', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name={getRestaurantIcon(restaurant.primaryType)} size={12} color="white" style={{ position: 'absolute', top: 5, zIndex:3}} />
            <MaterialCommunityIcons name="circle-medium"  size={32} color="rgb(51, 204, 255)" style={{ position: 'absolute', bottom:4, zIndex:1}} />
            <MaterialCommunityIcons name="map-marker" size={32} color="rgb(51, 204, 255)" style={{ position: 'absolute', zIndex:1}} />
          </View>
        </Marker>
        );
      })}

      </MapView>

      {/* Create a bottom sheet that will display restaurants*/}
      <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enableDynamicSizing={false}
    >
        <BottomSheetScrollView style={{ padding: 20 }}>
        {selectedRestaurantData ? (
          // Show restaurant details of selected restaurant
          <View>
            <TouchableOpacity onPress={() => setSelectedRestaurantData(null)} style={{ marginBottom: 10 }}>
              <Text style={{ color: 'blue' }}>← Back to list</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 26, fontWeight: 'bold', fontFamily: 'Arial' }}>
              {selectedRestaurantData.displayName || 'Restaurant Details'}
            </Text>
            <Text style={{ color: 'black', fontSize: 18 }}>
              {selectedRestaurantData.formattedAddress}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Text style={{ fontSize: 14 }}>
                {"Google Ratings: " + selectedRestaurantData.rating + ""}
              </Text>
              {/* Creates stars for the rating value */}
              {Array.from({ length: 5 }, (_, i) => {
                const starIndex = i + 1;
                if (starIndex <= Math.floor(selectedRestaurantData.rating)) {
                  return <Ionicons key={`star-${starIndex}`} name="star" size={16} color="gold" />;
                } else if (starIndex === Math.ceil(selectedRestaurantData.rating) && selectedRestaurantData.rating % 1 !== 0) {
                  return <Ionicons key={`star-${starIndex}`} name="star-half" size={16} color="gold" />;
                } else {
                  return <Ionicons key={`star-${starIndex}`} name="star-outline" size={16} color="gold" />;
                }
              })}
            </View>
            
            <Text style={{ fontSize: 14 }}>
              {"Price Level: " + selectedRestaurantData.priceLevel}
            </Text>
            {/* Add more details as needed, e.g., photos, reels, Hours, etc. */}
            <Text style={{ marginTop: 15, fontSize: 16, fontWeight: '600' }}>
              User Reviews
            </Text>
            <Text style={{ fontStyle: 'italic', color: 'gray' }}>
              (User reviews will be displayed here)
            </Text>
            <TouchableOpacity onPress={()  => setShowReviewForm(true)} >
              <Text style={{ color: 'blue', marginTop: 15 }}>
                Add a review
              </Text>
            </TouchableOpacity>
            {showReviewForm && (<CreateReview
              restaurantId={selectedRestaurantData._id}
              _onClose={() => setShowReviewForm(false)}
              />
            )}
          </View>
        ) : (
          // Show list of restaurants if a specific one has yet to be chosen.
          <>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Nearby Food
            </Text>
            {Array.isArray(restaurants) && restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <View key={restaurant._id} style={{ marginVertical: 10, paddingBottom: 10, borderBottomWidth: 1.5, borderColor: '#00eeff', backgroundColor: '#9eeee676', borderRadius: 8, padding: 15}}>
                  <TouchableOpacity onPress={() => handlerestaurantPress(restaurant._id)}>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>
                      {restaurant.displayName}
                    </Text>
                  
                  <Text style={{ color: 'gray' }}>
                    {restaurant.formattedAddress}
                  </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{ marginTop: 20, fontStyle: 'italic', color: 'gray' }}>
                No nearby restaurants found.
              </Text>
            )}
          </>
        )}
      </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
