import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';

export default function CreateReview({ restaurantId, _onClose }: Readonly<{ restaurantId: string; _onClose: () => void }>) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleStarPress = (starValue: number) => {
        setRating(starValue);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= rating;
            
            stars.push(
                <TouchableOpacity 
                    key={i}
                    onPress={() => handleStarPress(i)}
                >
                    <MaterialIcons
                        name={isFilled ? "star" : "star-outline"}
                        size={32}
                        color={isFilled ? "#FFD700" : "#ccc"}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const handleSubmit = async () => {
        if (!restaurantId) {
            Alert.alert('Error', 'Restaurant ID is missing.');
            return;
        }

        if (rating < 1) {
            Alert.alert('Validation', 'Please select a rating before submitting.');
            return;
        }

        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to submit a review.');
                return;
            }

            const response = await fetch('https://localbites-4m9e.onrender.com/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    placeId: restaurantId,
                    rating,
                    comment,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Error', data.message || 'Unable to submit review.');
                return;
            }

            Alert.alert('Success', 'Review submitted successfully.');
            _onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'Unexpected error submitting review.');
        }
    }

    return (
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
                Add your review
            </Text>
            
            <View style={{ flexDirection: 'row', marginTop: 15, gap: 10 }}>
                {renderStars()}
            </View>
            
            <TextInput
                style={{ marginTop: 15, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }}
                value={comment}
                onChangeText={setComment}
                maxLength={500}
                multiline
            />

            <View style={{ flexDirection: 'row', marginTop: 15, gap: 10 }}>
                <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                    onPress={_onClose}
                >
                    <Text style={{ color: 'black', textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }}
                    onPress={handleSubmit}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );  

}