// components/ListToolbar.js
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ListToolbar({ onAdd, onMove, onConfirm }) {
    return (
        <View style={styles.container}>
            <View style={styles.leftGroup}>
                <TouchableOpacity style={styles.button} onPress={onAdd}>
                    <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
                    <Text style={styles.label}>Añadir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onMove}>
                    <Ionicons name="swap-vertical-outline" size={24} color="#007AFF" />
                    <Text style={styles.label}>Desmarcar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.rightGroup}>
                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                    <Text style={[styles.label, { color: '#e74c3c' }]}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    leftGroup: {
        flexDirection: 'row',
        gap: 20,
    },
    rightGroup: {},
    button: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: '#333',
    },
});
