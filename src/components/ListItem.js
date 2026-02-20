import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ListItem({ item, showCheckboxes, onLongPress, onToggle, onPress }) {    
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    const getIconName = () => {
        switch (item.source) {
            case 'nota':
                return 'document-text-sharp';
            case 'lista':
                return 'list-sharp';
            case 'cuenta':
                return 'calculator-sharp';
            default:
                return 'document-text-sharp';
        }
    };

    const handlePress = () => {
        if (showCheckboxes) {
            onToggle(item.id);
        } else {
            onPress(item.source, item.title);
        }
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            onLongPress={() => onLongPress()} 
            delayLongPress={400}
            activeOpacity={0.7}
        >
            <View style={styles.itemContainer}>
                {showCheckboxes && (
                    <Checkbox
                        value={item.checked}
                        onValueChange={() => onToggle(item.id)}
                        style={styles.checkbox}
                    />
                )}            
                <Text style={styles.label}>{item.title}</Text>
                <Ionicons name={getIconName()} size={24} color={theme.textSecondary}/>
            </View>
        </TouchableOpacity>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    checkbox: {
        marginRight: 10,
    },
    label: {
        flex: 1,
        fontSize: 18,
        color: theme.text
    },
});