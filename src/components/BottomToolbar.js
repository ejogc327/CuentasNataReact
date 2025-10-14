import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // íconos bonitos

export default function BottomToolbar({ onPressLeft, onPressRight }) {
    return (
        <View style={styles.container}>
            {/* Sección izquierda (3 botones) */}
            <View style={styles.leftGroup}>
                <TouchableOpacity style={styles.button} onPress={() => onPressLeft('nota')}>
                    <Ionicons name="document-text-sharp" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => onPressLeft('lista')}>
                    <Ionicons name="list-sharp" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => onPressLeft('cuenta')}>
                    <Ionicons name="calculator-sharp" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {/* Sección derecha (2 botones) */}
            <View style={styles.rightGroup}>
                <TouchableOpacity style={styles.button} onPress={() => onPressRight('cancel')}>
                    <Ionicons name="close-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => onPressRight('save')}>
                    <Ionicons name="checkmark-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // alinear los grupos horizontalmente
        justifyContent: 'space-between', // separa izquierda y derecha
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    leftGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    rightGroup: {
        flexDirection: 'row',
        // alignItems: 'center',
        gap: 20,
    },
    button: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
    },
});