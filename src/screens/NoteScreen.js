import { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NoteScreen({ route }) {
    const { title } = route.params;
    const [text, setText] = useState('');
    useEffect(() => {
        const loadNote = async () => {
            try {
                const saved = await AsyncStorage.getItem('noteText');
                if (saved) {
                    setText(saved);
                }
            } catch (e) {
                console.log('Error loading note', e);
            }
        };
        loadNote();
    }, []);
    useEffect(() => {
        AsyncStorage.setItem('noteText', text).catch(e => console.log('Save error', e));
    }, [text]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>
            <TextInput 
                style={styles.input}
                multiline
                placeholder="Escribe tus notas aquí..."
                value={text}
                onChangeText={setText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
});