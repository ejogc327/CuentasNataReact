import { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAppData, saveAppData } from '../utils/storage';
import ScreenHeader from '../components/ScreenHeader';

export default function NoteScreen({ route, navigation }) {
    const [title, setTitle] = useState(route.params.title);
    const [text, setText] = useState('');

    useEffect(() => {
        const load = async () => {
            const data = await getAppData();
            if (data.note) setText(data.note);
        };
        load();
    }, []);

    useEffect(() => {
        saveAppData({ note: text, noteTitle:title });
    }, [text]);

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
                    <TextInput 
                        style={styles.input}
                        multiline
                        placeholder="Escribe tus notas aquí..."
                        value={text}
                        onChangeText={setText}
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
        padding: 10 
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        padding: 5,
    },
});