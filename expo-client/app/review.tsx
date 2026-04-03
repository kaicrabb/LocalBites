import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput} from 'react-native';
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

    const handleSubmit = () => {
        console.log('Submitting review:', { restaurantId, rating, comment });
        _onClose(); 
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
                    style={{ flex: 1, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }}
                    onPress={handleSubmit}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                    onPress={_onClose}
                >
                    <Text style={{ color: 'black', textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );  

}