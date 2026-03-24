import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateReview({ restaurantId, _onClose }: { restaurantId: string; _onClose: () => void }) {
    // Placeholder for the review form
    return (
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
                Add a Review for Restaurant ID: {restaurantId}
            </Text>
        </View>
    );
}