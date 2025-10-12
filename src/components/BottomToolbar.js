import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // íconos bonitos

export default function BottomToolbar() {
    return (
        <View style={styles.container}>
            {/* Sección izquierda (3 botones) */}
            <View style={styles.leftGroup}>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    <Text style={styles.label}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="search-outline" size={24} color="black" />
                    <Text style={styles.label}>Buscar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="heart-outline" size={24} color="black" />
                    <Text style={styles.label}>Favoritos</Text>
                </TouchableOpacity>
            </View>
            {/* Sección derecha (2 botones) */}
            <View style={styles.rightGroup}>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="chatbubble-outline" size={24} color="black" />
                    <Text style={styles.label}>Mensajes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="person-outline" size={24} color="black" />
                    <Text style={styles.label}>Perfil</Text>
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
        alignItems: 'center',
        gap: 20,
    },
    button: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
    },
});