import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // íconos bonitos
import { useTheme } from '../context/ThemeContext';

export default function HomeToolbar({ onPressLeft, onPressRight, selectionMode }) {
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    return (
        <View style={styles.container}>
            {/* Sección izquierda (3 botones) */}
            <View style={styles.leftGroup}>
                {/* Botones izquierdos (se deshabilitan en modo selección) */}
                <TouchableOpacity style={styles.button} disabled={selectionMode} onPress={() => onPressLeft('nota')}>
                    <Ionicons name="document-text-sharp" size={24} color={theme.blue} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} disabled={selectionMode} onPress={() => onPressLeft('lista')}>
                    <Ionicons name="list-sharp" size={24} color={theme.blue} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} disabled={selectionMode} onPress={() => onPressLeft('cuenta')}>
                    <Ionicons name="calculator-sharp" size={24} color={theme.blue} />
                </TouchableOpacity>
            </View>
            {/* Sección derecha (2 botones) */}
            <View style={styles.rightGroup}>
                {/* Botones derechos (solo visibles en modo selección) */}
                {selectionMode && (
                    <>
                        <TouchableOpacity style={styles.button} onPress={() => onPressRight('cancel')}>
                            <Ionicons name="close-outline" size={24} color={theme.blue} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => onPressRight('save')}>
                            <Ionicons name="checkmark-outline" size={24} color={theme.blue} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row', // alinear los grupos horizontalmente
        justifyContent: 'space-between', // separa izquierda y derecha
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: theme.bg,
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
    disabled : {
        opacity: 0.4,
    }
});