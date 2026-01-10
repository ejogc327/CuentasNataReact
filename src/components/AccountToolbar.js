// components/AccountToolbar.js
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AccountToolbar({ onAddAccount, onCalculate }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onAddAccount}>
                <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
                <Text style={styles.label}>Añadir cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCalculate}>
                <Ionicons name="calculator-outline" size={24} color="#007AFF" />
                <Text style={styles.label}>Calcular</Text>
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
