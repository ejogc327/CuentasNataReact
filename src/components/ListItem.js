import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

export default function ListItem({ item, showCheckboxes, onLongPress, onToggle }) {
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

    return (
        <View style={styles.itemContainer}>
            {showCheckboxes && (
                <Checkbox
                    value={item.checked}
                    onValueChange={() => onToggle(item.id)}
                    style={styles.checkbox}
                />
            )}
            <TouchableOpacity 
                onLongPress={() => onLongPress(item.id)}  
                delayLongPress={600}
                style={{ flex: 1 }}
                activeOpacity={0.7}
            >
                <Text style={styles.label}>{item.title}</Text>
            </TouchableOpacity>
                <Ionicons name={getIconName()} size={24} color="#333"/>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'space-between',
    },
    checkbox: {
        marginRight: 10,
    },
    label: {
        flex: 1,
        fontSize: 18,
    },
});