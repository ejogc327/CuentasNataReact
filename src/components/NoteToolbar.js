import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function NoteToolbar({ onSave, onClear }) {
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.leftGroup}>
                
            </View>
            <View style={styles.rightGroup}>
                <TouchableOpacity style={styles.button} onPress={onSave}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: theme.bg,
    },
    leftGroup: {
        flexDirection: 'row',
        marginLeft: 20,
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