import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAppData, saveAppData } from '../utils/storage';
import ScreenHeader from '../components/ScreenHeader';

export default function ListScreen({ route, navigation }) {
    const [title, setTitle] = useState(route.params.title);
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    
    useEffect(() => {
        const load = async () => {
            const data = await getAppData();
            if (data.list) setItems(data.list);
        };
        load();
    }, []);

    useEffect(() => {
        saveAppData({ list: items, listTitle:title });
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
        <SafeAreaView style={styles.safeArea}>
            <ScreenHeader 
                navigation={navigation}
                icon="document-text-sharp"
                title={title}
                setTitle={setTitle}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <View style={styles.container}>
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
                            <View style={styles.itemRow}>
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {        
        flex: 1,
        backgroundColor: '#fff',
    },
    container: { 
        flex: 1, 
        padding: 20 
    },
    header: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    inputRow: { 
        flexDirection: 'row', 
        marginBottom: 10 
    },
    input: {
        flex: 1, 
        borderWidth: 1, 
        borderColor: '#ccc',
        borderRadius: 10, 
        padding: 8, 
        fontSize: 16,
    },
    addButton: {
        marginLeft: 10, 
        backgroundColor: '#4CAF50',
        borderRadius: 10, 
        paddingHorizontal: 15, 
        justifyContent: 'center',
    },
    addText: { 
        color: '#fff', 
        fontSize: 20 
    },
    itemRow: {
        flexDirection: 'row', 
        alignItems: 'center',
        paddingVertical: 8, 
        borderBottomWidth: 1, 
        borderColor: '#eee',
    },
    dropdown: { 
        marginRight: 10 
    },
    itemText: { 
        flex: 1, 
        fontSize: 16, 
        marginLeft: 8 
    },
    deleteText: { 
        fontSize: 18, 
        color: '#e74c3c' 
    },
});