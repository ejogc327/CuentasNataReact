import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ScreenHeader({ navigation, icon, title, setTitle, endEditing }) {
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    return (
        <View style={styles.header}>
            {/* Botón Back */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Ícono principal */}
            <Ionicons  style={styles.icon} name={icon} size={24} color={theme.textSecondary} />

            {/* Título editable */}
            <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                onEndEditing={endEditing}
                placeholder="Sin título"
                maxLength={50}
            />
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.bg,
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
        color: theme.text
    },
});