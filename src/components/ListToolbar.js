// components/ListToolbar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ListToolbar({ onAdd, onMove, onConfirm, moveMode }) {
    return (
        <View style={styles.container}>
            <View style={styles.leftGroup}>
                <TouchableOpacity 
                    style={[ 
                        styles.button, 
                        moveMode && styles.disabled
                    ]} 
                    onPress={onAdd} 
                    disabled={moveMode}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onMove}>
                    <Ionicons name="swap-vertical-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
            <View style={styles.rightGroup}>
                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    height: 56,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    },
    leftGroup: {
        flexDirection: 'row',
        marginLeft: 20,
    },
    rightGroup: {},
    button: {
        alignItems: 'center',
        marginRight: 20,
    },
    label: {
        fontSize: 12,
        color: '#333',
    },
    disabled: {
        opacity: 0.4,
    }
});
