import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SelectionToolbar({ selectedCount, onClear, onAction }) {
    const { theme } = useTheme();
    const styles = makeStyles(theme);
    
    //if (selectedCount === 0) return null;

    return (
        <View style={styles.toolbar}>
            <View style={styles.leftGroup}>
                <TouchableOpacity onPress={onClear}>
                    <Text style={styles.clearText}>❌ Clear</Text>
                </TouchableOpacity>
                <Text style={styles.count}>{selectedCount}</Text>
            </View>
            <View style={styles.rightGroup}>
                <TouchableOpacity onPress={() => onAction('export')}>
                    <MaterialIcons name="upload-file" size={24} color={theme.blue} />                    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAction('copy')}>
                    <MaterialIcons name="content-copy" size={24} color={theme.blue} />                    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAction('remove')}>
                    <MaterialIcons name="delete" size={24} color="#ff4d4d" />                    
                </TouchableOpacity>
            </View>
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: theme.bg,
    },
    leftGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    clearText: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    count: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.textSecondary,
    },
    rightGroup: {
        flexDirection: 'row',
        gap: 20,
    },
    icon: {
        fontSize: 18,
    },
});