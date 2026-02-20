// components/AccountToolbar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AccountToolbar({ onAdd, onMove, onConfirm, moveMode, onDelete, onCalendar, onPlusMinus, calendarMode }) {
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.leftGroup}>
                <TouchableOpacity 
                    style={[
                        styles.button,
                        moveMode && styles.disabled
                    ]}
                    onPress={onAdd}
                    disabled={moveMode}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onMove}>
                    <Ionicons name="swap-vertical-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[ 
                        styles.button,
                        moveMode && styles.disabled
                    ]} 
                    onPress={onDelete}
                    disabled={moveMode}
                >
                    <Ionicons name="trash-outline" size={24} color="#307aFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[ 
                        styles.button,
                        moveMode && styles.disabled,
                        calendarMode && styles.active
                    ]} 
                    onPress={onCalendar}
                    disabled={moveMode}
                >
                    <Ionicons name="calendar-outline" size={24} color={calendarMode ? theme.muted : theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[ 
                        styles.button,
                        moveMode && styles.disabled
                    ]} 
                    onPress={onPlusMinus}
                    disabled={moveMode}
                >
                    <Text style={{ fontSize: 24, color: theme.text }}>±</Text>
                </TouchableOpacity>
            </View>            
            <View style={styles.rightGroup}>
                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: theme.bg,
    },
    leftGroup: {
        flexDirection: 'row',
        marginLeft: 20,
    },
    rightGroup: {},
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        position: 'relative',
    },
    minusIcon: {
        position: 'absolute',
        bottom: -2,
        right: -2,
    },
    label: {
        fontSize: 12,
        color: '#333',
    },
    disabled: {
        opacity: 0.4,
    },
    active: {
        backgroundColor: '#9b59b6',
        borderRadius: 8,
        padding: 4,
    },
});
