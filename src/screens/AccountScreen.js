import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen({ route }) {
    const { title } = route.params;
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const saved = await AsyncStorage.getItem('accountItems');
                if (saved) {
                    setAccounts(JSON.parse(saved));
                }
            } catch (e) {
                console.log('Error loading accounts', e);
            }
        };
        loadAccounts();
    }, []);
    useEffect(() => {
        AsyncStorage.setItem('accountItems', JSON.stringify(accounts)).catch(e => console.log('Save error', e));
    }, [accounts]);

    const addAccount = () => {
        setAccounts([...accounts, { id: Date.now().toString(), text: '', value: '', checked: false, include: false }]);
    };

    const updateAccount = (id, field, value) => {
        setAccounts(accounts.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>
            <TouchableOpacity onPress={addAccount} style={styles.addButton}>
                <Text style={styles.addText}>＋ Añadir cuenta</Text>
            </TouchableOpacity>
            <FlatList
                data={accounts}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.dropdown}>
                            <Text>⮟</Text>
                        </TouchableOpacity>
                        <Checkbox
                            value={item.checked}
                            onValueChange={(v) => updateAccount(item.id, 'checked', v)}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Descripción"
                            value={item.text}
                            onChangeText={(t) => updateAccount(item.id, 'text', t)}
                        />
                        <TextInput
                            style={styles.numInput}
                            placeholder="Valor"
                            keyboardType="numeric"
                            value={String(item.value)}
                            onChangeText={(v) => updateAccount(item.id, 'value', v)}
                        />
                        <Checkbox
                            value={item.include}
                            onValueChange={(v) => updateAccount(item.id, 'include', v)}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    addButton: {
        backgroundColor: '#4CAF50', borderRadius: 10,
        paddingVertical: 10, alignItems: 'center', marginBottom: 10,
    },
    addText: { color: '#fff', fontSize: 16 },
    row: {
        flexDirection: 'row', alignItems: 'center',
        borderBottomWidth: 1, borderColor: '#eee',
        paddingVertical: 8,
    },
    dropdown: { marginRight: 10 },
    textInput: {
        flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        paddingHorizontal: 8, marginHorizontal: 6, fontSize: 14,
    },
    numInput: {
        width: 80, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        paddingHorizontal: 6, fontSize: 14, marginRight: 6,
    },
});