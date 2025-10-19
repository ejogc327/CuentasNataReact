import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListScreen({ route }) {
    const { title } = route.params;
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    
    useEffect(() => {
        const loadList = async () => {
            try {
                const saved = await AsyncStorage.getItem('listItems');
                if (saved) {
                    setItems(JSON.parse(saved));
                }
            } catch (e) {
                console.log('Error loading list', e);
            }
        };
        loadList();
    }, []);
    useEffect(() => {
        AsyncStorage.setItem('listItems', JSON.stringify(items)).catch(e => console.log('Save error', e));
    }, [items]);

    const addItem = () => {
        if (!text.trim()) return;
        setItems([...items, { id: Date.now().toString(), text, checked: false }]);
        setText('');
    };

    const toggleItem = (id) => {
        setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Nuevo ítem..."
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity onPress={addItem} style={styles.addButton}>
                    <Text style={styles.addText}>＋</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity style={styles.dropdown}>
                            <Text style={{ fontSize: 16 }}>⮟</Text>
                        </TouchableOpacity>
                        <Checkbox
                            value={item.checked}
                            onValueChange={() => toggleItem(item.id)}
                        />
                        <Text style={[styles.itemText, item.checked && { textDecorationLine: 'line-through' }]}>
                            {item.text}
                        </Text>
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Text style={styles.deleteText}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    inputRow: { flexDirection: 'row', marginBottom: 10 },
    input: {
        flex: 1, borderWidth: 1, borderColor: '#ccc',
        borderRadius: 10, padding: 8, fontSize: 16,
    },
    addButton: {
        marginLeft: 10, backgroundColor: '#4CAF50',
        borderRadius: 10, paddingHorizontal: 15, justifyContent: 'center',
    },
    addText: { color: '#fff', fontSize: 20 },
    itemRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee',
    },
    dropdown: { marginRight: 10 },
    itemText: { flex: 1, fontSize: 16, marginLeft: 8 },
    deleteText: { fontSize: 18, color: '#e74c3c' },
});