import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAppData, saveAppData } from '../utils/storage';
import ScreenHeader from '../components/ScreenHeader';

export default function AccountScreen({ route, navigation }) {
    const [title, setTitle] = useState(route.params.title);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await getAppData();
            if (data.account) setAccounts(data.account);
        };
        load();
    }, []);

    useEffect(() => {
        saveAppData({ account: accounts });
    }, [accounts]);

    const addAccount = () => {
        setAccounts([...accounts, { id: Date.now().toString(), text: '', value: '', checked: false, include: false }]);
    };

    const updateAccount = (id, field, value) => {
        setAccounts(accounts.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
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
    addButton: {
        backgroundColor: '#4CAF50', 
        borderRadius: 10,
        paddingVertical: 10, 
        alignItems: 'center', 
        marginBottom: 10,
    },
    addText: { color: '#fff', 
        fontSize: 16 

    },
    row: {
        flexDirection: 'row', 
        alignItems: 'center',
        borderBottomWidth: 1, 
        borderColor: '#eee',
        paddingVertical: 8,
    },
    dropdown: { 
        marginRight: 10 

    },
    textInput: {
        flex: 1, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8,
        paddingHorizontal: 8, 
        marginHorizontal: 6, 
        fontSize: 14,
    },
    numInput: {
        width: 80, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8,
        paddingHorizontal: 6, 
        fontSize: 14, 
        marginRight: 6,
    },
});