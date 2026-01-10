import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoteToolbar({ onSave, onClear }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onSave}>
                <Ionicons name="save-outline" size={24} color="#333" />
                <Text style={styles.label}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClear}>
                <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                <Text style={[styles.label, { color: '#e74c3c' }]}>Borrar</Text>
            </TouchableOpacity>
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
    button: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: '#333',
    },
});