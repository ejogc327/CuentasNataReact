import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScreenHeader({ navigation, icon, title, setTitle }) {
    return (
        <View style={styles.header}>
            {/* Botón Back */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {/* Ícono principal */}
            <Ionicons name={icon} size={24} color="#333" style={styles.icon} />

            {/* Título editable */}
            <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Sin título"
                maxLength={50}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        paddingBottom: 10,
        paddingLeft: 5,
    },
    icon: {
        marginHorizontal: 10,
    },
    titleInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 4,
    },
});