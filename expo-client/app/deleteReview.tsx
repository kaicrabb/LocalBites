import { Text, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface DeleteReviewProps {
  reviewId: string;
  onDelete: (reviewId: string) => void;
}

export default function DeleteReview({ reviewId, onDelete }: DeleteReviewProps) {
  const handleDeleteReview = async () => {
    if (!reviewId) {
      Alert.alert('Error', 'Missing reviewId.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('Unauthorized', 'Log in to delete your review.');
        return;
      }

      const response = await fetch('https://localbites-4m9e.onrender.com/reviews', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewId }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Error', data.message || 'Failed to delete review.');
        return;
      }

      if (typeof onDelete === 'function') {
        onDelete(reviewId);
      }
      Alert.alert('Success', 'Review deleted successfully.');
    } catch (err) {
      console.error('deleteReview err', err);
      Alert.alert('Error', 'Unable to delete review.');
    }
  };

  return (
    <TouchableOpacity onPress={handleDeleteReview}>
      <Text style={{ color: '#d9534f', fontWeight: '600' }}>Delete Review</Text>
    </TouchableOpacity>
  );
}