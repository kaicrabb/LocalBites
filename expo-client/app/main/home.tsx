import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { Checkbox } from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { auth } from '../../config/firebaseConfig';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import CreateReview from '../review';

async function getUserLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.log('Permission denied');
    return null;
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return location.coords
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
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<string[]>([]);
  const [selectedGoogleRating, setSelectedGoogleRating] = useState<string[]>([]);
  const [radius, setRadius] = useState(30);
  const [userLocation, setUserLocation] = useState({
    latitude: 40.3589695,
    longitude: -94.8831951,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  async function updateLocation() {
    const coords = await getUserLocation();
    if (!coords) return;

    setUserLocation(prev => ({
      ...prev,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));
  }

  useEffect(() => {
    updateLocation(); // initial
    console.log('User location updated:', userLocation);

    const interval = setInterval(() => {
      updateLocation();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 

  // Snap positions
  const snapPoints = useMemo(() => ['5%', '50%', '75','100%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Sheet position:', index);
  }, []);
  

  const getDistanceInMiles = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 3958.8; // Earth radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getNearbyRestaurants = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      console.log('Fetching nearby restaurants');
      const response = await fetch(
        `https://localbites-4m9e.onrender.com/Google_Api/nearby_restaurants?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=${radius*1609}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Sorting nearby restaurants by name');
      data.sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));
      // console.log('Raw nearby restaurants response:', data);
      setRestaurants(data);
      console.log('Nearby restaurants updated:', data.length);
      // console.log('Nearby restaurants:', data.restaurants);
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
    }
  };

  const fetchReviews = async (restaurantId: string) => {
    setReviewLoading(true);
    setReviewError(null);
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(
        `https://localbites-4m9e.onrender.com/reviews?placeId=${restaurantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setReviewError(data.message || 'Unable to load reviews.');
        setReviews([]);
      } else {
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviewError('Unable to load reviews.');
      setReviews([]);
    } finally {
      setReviewLoading(false);
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
      console.log('Restaurant details response:', data);
      
      setSelectedRestaurantData(data);
      await fetchReviews(restaurantId);
      bottomSheetRef.current?.snapToIndex(3);
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={checkRestaurants}>
          <View style={{ padding: 10 }}>
            <MaterialCommunityIcons name = 'refresh' size={24}/>
          </View>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={filtermenu}>
          <View style = {{ padding: 10}}>
            <MaterialCommunityIcons name = 'filter' size={24}/>
          </View>
        </TouchableOpacity>
      )
    });
  }, []);

  const checkRestaurants = async () => {
    // try pulling restaurants from our database, if nothing shows up then pull from google API, if nothing shows up alert user that there are no Restaurants in their area.
    console.log('updating location and checking restaurants...');
    // wait for location to update before pulling restaurants from database, if location is not updated then it will pull based on old location and may not show any restaurants even if there are some nearby.
    updateLocation();
    await delay(2000); // wait 2 seconds for location to update, not ideal
    console.log('Current user location:', userLocation);
    getNearbyRestaurants();
    // console.log('Current restaurants:', restaurants[0]);
    if (restaurants.length === 0) {
      // pull new data from Google API and update restaurants state
      try {
        const token = await SecureStore.getItemAsync('token');
        console.log('No restaurants found, fetching from Google API');
          const response = await fetch(`https://localbites-4m9e.onrender.com/Google_Api/get_location?lat=${userLocation.latitude}&long=${userLocation.longitude}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
          console.log('Google API response status:', response.status);
          
          const data = await response.json();
          console.log('Google API data:', data);
          await delay(3000);
          getNearbyRestaurants();
          // alert users if there are still no restaurants after pulling from Google API
            if (restaurants.length === 0) {
              alert('No restaurants found in your area. Please try again later.');
            }
        } catch (error) {
          console.error('Error fetching nearby restaurants from Google API:', error);
        }
      }
  };

  const filtermenu = () => {
    setShowFilterForm(true);
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine) // remove if already selected
        : [...prev, cuisine] // add if not selected
    );
  };

  const cuisineMap: Record<string, string> = {
    American: 'american_restaurant',
    Mexican: 'mexican_restaurant',
    Japanese: 'japanese_restaurant',
    Chinese: 'chinese_restaurant',
    'Bar and Grill': 'bar_and_grill',
    Pizza: 'pizza',
    Italian: 'italian_restaurant',
    Buffet: 'buffet_restaurant',
    'Fast Food': 'fast_food_restaurant',
    Greek: 'greek_restaurant',
    Thai: 'thai_restaurant',
    Catering: 'catering_service',
    'Health Food': 'health_food_store',
    'Coffee Shop': 'coffee_shop',
  };

  const togglePriceLevel = (priceLevel: string) => {
    setSelectedPriceLevel(prev =>
      prev.includes(priceLevel)
        ? prev.filter(c => c !== priceLevel)
        : [...prev, priceLevel] 
    );
  };

  const priceMap: Record<string, string> ={
    Free: 'price_level_free',
    'Inexpensive ($)': 'price_level_inexpensive',
    'Moderate ($$)': 'price_level_moderate',
    'Expensive ($$$)': 'price_level_expensive',
    'Very Expensive ($$$$)': 'price_level_very_expensive',
    Unknown: 'price_level_unspecified',
  }

  const toggleGoogleRating = (rating: string) => {
    setSelectedGoogleRating(prev =>
      prev.includes(rating)
        ? prev.filter(c => c !== rating)
        : [...prev, rating] 
    );
  };

  type range = [number,number];

  const googleRatingMap: Record<string, range> = {
    '0 - 1 Stars': [0,1],
    '1 - 2 Stars': [1,2],
    '2 - 3 Stars': [2,3],
    '3 - 4 Stars': [3,4],
    '4 - 5 Stars': [4,5]
  }


  const filteredRestaurants = Array.isArray(restaurants)
    ? restaurants.filter(r => {
      const matchesCuisine =
        selectedCuisines.length === 0 || selectedCuisines.some(label => {
          const apiType = cuisineMap[label];
          return r.primaryType?.toLowerCase().includes(apiType);
        });
      
      const matchesPrice = 
        selectedPriceLevel.length === 0 || selectedPriceLevel.some(label => {
          const apiType = priceMap[label];
          return r.priceLevel?.toLowerCase().includes(apiType);
        });
      
      const matchesGoogleRating = 
        selectedGoogleRating.length === 0 || selectedGoogleRating.some(label => {
          const [min, max] = googleRatingMap[label] || [];
          return r.rating >= min && r.rating <= max;
        });
      
      const matchesRadius = 
        radius === 0 || getDistanceInMiles(
          userLocation.latitude,
          userLocation.longitude,
          r.location.coordinates[1], // lat
          r.location.coordinates[0]  // lng
        ) <= radius;
      return matchesCuisine && matchesPrice && matchesGoogleRating && matchesRadius;
      })
    : [];


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
  const getPriceLevel = (priceLevel: string): React.ReactNode => {
          const lowerType = priceLevel?.toLowerCase() || '';
          if (lowerType.includes('price_level_free')) return <Text style={{fontSize:16, fontWeight:"600"}}>FREE</Text>;
          const icon = <Ionicons name="logo-usd" key="usd" size={16} color="rgb(55, 128, 55)" />;
          if (lowerType.includes('price_level_inexpensive')) return icon;
          if (lowerType.includes('price_level_moderate'))
            return (
              <>
                {[...Array(2)].map((_, i) => <Ionicons key={i} name="logo-usd" size={16} color="rgb(55, 128, 55)"/>)}
              </>
            );
          if (lowerType.includes('price_level_expensive'))
            return (
              <>
                {[...Array(3)].map((_, i) => <Ionicons key={i} name="logo-usd" size={16} color="rgb(55, 128, 55)"/>)}
              </>
            );
          if (lowerType.includes('price_level_very_expensive'))
            return (
              <>
                {[...Array(4)].map((_, i) => <Ionicons key={i} name="logo-usd" size={24} color="rgb(55, 128, 55)"/>)}
              </>
            );
          return <Text style={{fontSize:16, fontWeight:"600"}}>Unknown</Text>;
        };

  const renderReviewSection = () => {
    if (reviewLoading) {
      return (
        <Text style={{ marginTop: 10, fontStyle: 'italic', color: 'gray' }}>
          Loading reviews...
        </Text>
      );
    }

    if (reviewError) {
      return (
        <Text style={{ marginTop: 10, color: 'red' }}>
          {reviewError}
        </Text>
      );
    }

    if (reviews.length === 0) {
      return (
        <Text style={{ marginTop: 10, fontStyle: 'italic', color: 'gray', paddingBottom:30 }}>
          No reviews yet for this restaurant.
        </Text>
      );
    }

    return (
      <View style={{ marginTop: 10, paddingBottom: 30 }}>
        {reviews.map((review) => (
          <View key={review._id} style={{ marginVertical: 6, backgroundColor: '#ffffff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#ddd' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ fontWeight: '700', marginRight: 8 }}>
                {review.User?.Username || review.User?.Email || 'Anonymous'}
              </Text>
              <Text style={{ color: '#666' }}>
                {Array.from({ length: 5 }, (_, i) => {
                  const starIndex = i + 1;
                  return (
                    <Text key={starIndex} style={{ color: starIndex <= review.Rating ? '#FFD700' : '#ccc' }}>
                      ★
                    </Text>
                  );
                })}
              </Text>
            </View>
            <Text style={{ color: '#444' }}>{review.Comment || 'No comment provided.'}</Text>
          </View>
        ))}
      </View>
    );
  };

  //Write restaurant details here, you want to do the photos in a carosel and the opening hours. 
  // you might want to look at the google reviews to see. 

  return (
    // Sets up home page view
    <View style={{ flex: 1 }}>
      {/* Setup the map and its markers */}
      <MapView style={StyleSheet.absoluteFillObject}
      
      provider={PROVIDER_GOOGLE}
      region={userLocation}
      customMapStyle={mapStyle}
      showsUserLocation
      showsMyLocationButton
      ref={mapRef}
      >
      
      
      
      {Array.isArray(restaurants) &&
      filteredRestaurants.map((restaurant) => {

        // function for choosing what icon to use on map for that restaurant.
        const getRestaurantIcon = (primaryType: string) => {
          const lowerType = primaryType?.toLowerCase() || '';
          if (lowerType.includes('american_restaurant')) return 'hamburger';
          if (lowerType.includes('bar_and_grill')) return 'grill';
          if (lowerType.includes('japanese_restaurant') || lowerType.includes('thai_restaurant') || lowerType.includes('asian_restaurant')) return 'noodles';
          if (lowerType.includes('pizza_delivery')) return 'pizza';
          if (lowerType.includes('italian_restaurant')) return 'pasta';
          if (lowerType.includes('mexican_restaurant')) return 'taco';
          if (lowerType.includes('chinese_restaurant')) return 'rice';
          if (lowerType.includes('steak_house')) return 'food-steak';
          if (lowerType.includes('buffet_restaurant')) return 'buffet';
          if (lowerType.includes('fast_food_restaurant')) return 'food';
          if (lowerType.includes('coffee_shop')) return 'coffee';

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

      {showFilterForm && ( <><TouchableOpacity
      activeOpacity={1}
      onPress={() => setShowFilterForm(false)} // tap outside to close
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)', // THIS is the dim effect
        zIndex: 999,
      }}
    />
      <ScrollView style={{
          position: 'absolute',
          top: 40, 
          left: 20,
          right: 20,
          bottom: 40,
          backgroundColor: 'rgb(255, 251, 251)',
          padding: 15,
          borderRadius: 10,
          zIndex: 1000,
          elevation: 10, 
        }}>
          {/* filter by multiple information types, primary type (cuisine), pricelevel, rating(google), rating(reviews)?, distance up to 50 miles (defualt radius)*/}
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10}}>
              <TouchableOpacity onPress={() => setShowFilterForm(false)} style={{position: 'absolute', left: 0, padding: 5}}>
                <MaterialCommunityIcons name="arrow-u-left-top-bold" size={32} />
              </TouchableOpacity>
              <Text style={{ fontSize: 32, fontWeight: 'bold', marginLeft: 20}}>
                Filters
              </Text>
            </View>
            <Text style={{fontSize:20, fontWeight: 'bold', paddingTop:25}}>Set Radius (Miles)</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#51CCFF' }}>{radius}</Text>
            <Slider
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={radius}
                onValueChange={val => setRadius(val)}
                minimumTrackTintColor="#51CCFF"
                maximumTrackTintColor="#000000"
                
              />

            <Text style={{fontSize:20, fontWeight: 'bold', paddingTop:25}}>Cuisine Type</Text>
            {Object.keys(cuisineMap).map(label => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  value={selectedCuisines.includes(label)}
                  onValueChange={() => toggleCuisine(label)}
                />
                <Text>{label}</Text>
              </View>
            ))}

            <Text style={{fontSize:20, fontWeight: 'bold', paddingTop:25}}>Price Level</Text>
              {Object.keys(priceMap).map(label => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  value={selectedPriceLevel.includes(label)}
                  onValueChange={() => togglePriceLevel(label)}
                />
                <Text>{label}</Text>
              </View>
              ))}

              <Text style={{fontSize:20, fontWeight: 'bold', paddingTop:25}}>Google Rating</Text>
              {Object.keys(googleRatingMap).map(label => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  value={selectedGoogleRating.includes(label)}
                  onValueChange={() => toggleGoogleRating(label)}
                />
                <Text>{label}</Text>
              </View>
              ))}

              <Text style={{fontSize:20, fontWeight: 'bold', paddingTop:25}}>Operating Hours</Text>
          </View>
        </ScrollView>
        </>
      )}

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
              <MaterialCommunityIcons name="arrow-u-left-top-bold" size={32} />
            </TouchableOpacity>
            <Text style={{ fontSize: 26, fontWeight: 'bold', fontFamily: 'Arial' }}>
              {selectedRestaurantData.displayName || 'Restaurant Details'}
            </Text>
            <Text style={{ color: 'black', fontSize: 18 }}>
              {selectedRestaurantData.formattedAddress}
            </Text>
            {selectedRestaurantData.regularOpeningHours && selectedRestaurantData.regularOpeningHours.weekdayDescriptions ? (
            <View style={{ marginTop: 5 }}>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>Operating Hours:</Text>
              {selectedRestaurantData.regularOpeningHours.weekdayDescriptions.map((desc, idx) => (
                <Text key={idx} style={{ fontSize: 14, marginLeft: 10 }}>
                  {desc}
                </Text>
              ))}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Text style={{ fontSize: 14 }}>
                Operating Hours: Not available
              </Text>
            </View>
            )}
             <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Text style={{ fontSize: 14 }}>
                {"Google Ratings: " + selectedRestaurantData.rating + " "}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Text style={{ fontSize: 14 }}>
                {"Price Level: "}
              </Text>
              {getPriceLevel(selectedRestaurantData.priceLevel)}
            </View>
            {/* Add more details as needed, e.g., photos, reels, Hours, etc. */}
            
            <TouchableOpacity onPress={()  => setShowReviewForm(true)} >
              <Text style={{ color: 'blue', marginTop: 15 }}>
                Add a review for {selectedRestaurantData.displayName}
              </Text>
            </TouchableOpacity>
            {showReviewForm && (<CreateReview
              restaurantId={selectedRestaurantData._id}
              _onClose={async () => {
                setShowReviewForm(false);
                await fetchReviews(selectedRestaurantData._id);
              }}
              />
            )}
            <Text style={{ marginTop: 15, fontSize: 16, fontWeight: '600' }}>
              User Reviews
            </Text>
            {renderReviewSection()}
          </View>
        ) : (
          // Show list of restaurants if a specific one has yet to be chosen.
          <>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Nearby Food
            </Text>
            {Array.isArray(restaurants) && filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
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
