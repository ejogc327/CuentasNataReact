import { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAppData, saveAppData } from '../utils/storage';
import ScreenHeader from '../components/ScreenHeader';
import NoteToolbar from '../components/NoteToolbar';

export default function NoteScreen({ route, navigation }) {
    const { id, title: initialTitle } = route.params;
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState('');

    useEffect(() => {
        const load = async () => {
            const data = await getAppData();
            if (data.notes && data.notes[id]) {
                setText(data.notes[id].text);
                setTitle(data.notes[id].title);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!id) return; // asegura que exista un ID
        const save = async () => {
            // Obtén las notas actuales
            const current = await getAppData();

            // Actualiza solo la nota actual por id
            const updatedNotes = {
                ...current.notes,         // merge de notas existentes
                [id]: { text, title }     // solo actualiza la nota actual
            };

            await saveAppData({ notes: updatedNotes });
        };

        save();
    }, [text, title, id]);

    const handleSave = () => {
        saveAppData({ nota: text, notaTitle: title });
        navigation.goBack();
    };
    const handleClear = () => {
        
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
                    <TextInput 
                        style={styles.input}
                        multiline
                        placeholder="Escribe tus notas aquí..."
                        value={text}
                        onChangeText={setText}
                    />
                </View>
                <NoteToolbar onSave={handleSave} onClear={handleClear} />
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