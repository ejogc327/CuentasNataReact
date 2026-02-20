import { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAppData, saveAppData } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
    const { darkMode, toggleDarkMode, theme } = useTheme();
    const [confirmDelete, setConfirmDelete] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getAppData();
            if (data.settings) {
                setDarkMode(data.settings.darkMode ?? false);
                setConfirmDelete(data.settings.confirmDelete ?? true);
            }
        };
        load();
    }, []);

    const saveSetting = async (key, value) => {
        const data = await getAppData();
        await saveAppData({
            settings: { ...data.settings, [key]: value }
        });
    };

    const handleDarkMode = (value) => {
        toggleDarkMode(value);
    };

    const handleConfirmDelete = (value) => {
        setConfirmDelete(value);
        saveSetting('confirmDelete', value);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right', 'bottom']}>
            <View style={[styles.header, { borderColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Configuración</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.muted }]}>APARIENCIA</Text>
                <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Ionicons name="moon-outline" size={20} color={theme.text} style={styles.rowIcon} />
                    <Text style={[styles.rowLabel, { color: theme.text }]}>Tema oscuro</Text>
                    <Switch value={darkMode} onValueChange={handleDarkMode} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.muted }]}>GENERAL</Text>
                <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Ionicons name="trash-outline" size={20} color={theme.text} style={styles.rowIcon} />
                    <Text style={[styles.rowLabel, { color: theme.text }]}>Confirmar al eliminar</Text>
                    <Switch value={confirmDelete} onValueChange={handleConfirmDelete} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const light = {
    bg: '#f5f5f5',
    card: '#fff',
    text: '#333',
    muted: '#999',
    border: '#eee',
};

const dark = {
    bg: '#1a1a1a',
    card: '#2a2a2a',
    text: '#f0f0f0',
    muted: '#666',
    border: '#333',
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        gap: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    rowIcon: {
        marginRight: 12,
    },
    rowLabel: {
        flex: 1,
        fontSize: 15,
    },
});