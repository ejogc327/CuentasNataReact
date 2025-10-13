import { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomToolbar from '../components/BottomToolbar';
import CustomModal from '../components/CustomModal';

export default function HomeScreen({ navigation }) {
    const [items, setItems] = useState([]); // Lista de títulos
    const [modalVisible, setModalVisible] = useState(false);
    const [currentButton, setCurrentButton] = useState('');
    const [inputText, setInputText] = useState('');

    // Abrir el modal
    const handleButtonPress = (buttonName) => {
        setCurrentButton(buttonName);
        setInputText('');
        setModalVisible(true);
    };

    // Guardar el título
    const handleSave = () => {
        if (inputText.trim() !== '') {
            setItems([...items, { id: Date.now().toString(), title: inputText }]);
        }
        setModalVisible(false);
    }

    // Cerrar sin guardar
    const handleCancel = () => setModalVisible(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Lista de títulos */}
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>}
                    ListEmptyComponent={<Text style={styles.empty}>Aún no hay títulos guardados</Text>}
                />

                {/* Modal de entrada */ }
                <CustomModal
                    visible={modalVisible}
                    title={`Nueva ${currentButton}`}
                    description={`Agrega el título de la ${currentButton}`}
                    inputValue={inputText}
                    onChangeText={setInputText}
                    onCancel={handleCancel}
                    onSave={handleSave}
                />
                
                {/* Barra inferior */}
                <View style={styles.toolbarContainer}>
                    <BottomToolbar onPressLeft={handleButtonPress} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between', // empuja el toolbar abajo
        marginLeft: 10,
    },
    item: {
        fontSize: 18,
        marginVertical: 6,
    },
    empty: {
        textAlign: 'center',
        color: '#777',
        marginTop: 20,
    },
    toolbarContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },    
});