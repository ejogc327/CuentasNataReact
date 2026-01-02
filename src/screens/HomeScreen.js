import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAppData, saveAppData } from '../utils/storage';
import HomeToolbar from '../components/HomeToolbar';
import SelectionToolbar from '../components/SelectionToolbar';
import CustomModal from '../components/CustomModal';
import ListItem from '../components/ListItem';

export default function HomeScreen({ navigation }) {
    const [items, setItems] = useState([]); // Lista de items
    const [modalVisible, setModalVisible] = useState(false);
    const [currentButton, setCurrentButton] = useState('');
    const [inputText, setInputText] = useState('');
    const [selectionMode, setSelectionMode] = useState(false);
    const [pages, setPages] = useState([
        { id: '1', title: 'Notas', type: 'note' },
        { id: '2', title: 'Listas', type: 'list' },
        { id: '3', title: 'Cuentas', type: 'account' },
    ]);

    // Cargar los ítems al entrar al home
    useEffect(() => {
        const load = async () => {
            const data = await getAppData();
            if (data.homeItems) {
                setItems(data.homeItems);
            }
        };
        load();
    }, []);

    // Guardar ítems cada vez que cambian
    useEffect(() => {
        saveAppData({ homeItems: items });
    }, [items]);

    // Abrir el modal
    const handleButtonPress = (source, title) => {
        if (source === 'nota') navigation.navigate('Nota', { title });
        if (source === 'lista') navigation.navigate('Lista', { title });
        if (source === 'cuenta') navigation.navigate('Cuenta', { title });
        
    };

    // Abrir el modal
    const handleLeftButtonPress = (buttonName) => {
        setCurrentButton(buttonName);
        setInputText('');
        setModalVisible(true);
    };
    // Guardar el título
    const handleSave = () => {
        if (inputText.trim() !== '') {
            setItems([
                ...items, 
                { 
                    id: Date.now().toString(), 
                    title: inputText ,
                    source: currentButton, // Guarda de qué botón vino
                    checked: false,
                }
            ]);
        }
        setModalVisible(false);
    }

    // Cerrar sin guardar
    const handleCancel = () => setModalVisible(false);

    // Lista
    const toggleCheckbox = (id) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        )
    }

    const handleLongPress = () => {
        setSelectionMode(true);
    }

    // === Toolbar ===
    const handleRightButtonPress = (buttonName) => {
        // Al presionar un botón del lado derecho, ocultamos los checkboxes
        setSelectionMode(false);
        // Desmarcamos todos los ítems
        setItems(items.map((i) => ({ ...i, checked: false })));
        console.log(`Botón derecho presionado: ${buttonName}`);
    }

    const handleClear = () => {
        setSelectionMode(false);
        setItems(items.map((i) => ({ ...i, checked: false })));
    }

    const handleAction = (type) => {
        console.log('Acción desde toolbar superior:', type);
    }

    const selectedCount = items.filter((i) => i.checked).length;

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
            <View style={styles.container}>
                {/* Lista de títulos */}
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ListItem
                            item={item}
                            showCheckboxes={selectionMode}
                            onLongPress={handleLongPress}
                            onToggle={toggleCheckbox}
                            onPress={handleButtonPress}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>Aún no hay títulos guardados</Text>}
                    contentContainerStyle={{ paddingBottom:120}}
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

                <View style={styles.toolbarContainer}>
                    {/* Toolbar de selección */}
                    {selectionMode && (
                        <View style={styles.selectionToolbarContainer}>
                            <SelectionToolbar
                                selectedCount={selectedCount}
                                onClear={handleClear}
                                onAction={handleAction}
                            />
                        </View>
                    )}
                    
                    {/* Barra inferior */}
                    {/* <View style={styles.toolbarContainer}> */}
                    <HomeToolbar 
                        onPressLeft={handleLeftButtonPress} 
                        onPressRight={handleRightButtonPress}
                        selectionMode={selectionMode}
                    />
                </View>
            </View>
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
    },
    empty: {
        textAlign: 'center',
        color: '#777',
        marginTop: 20,
    },
    toolbarContainer: {
        position: "relative",
    },
    selectionToolbarContainer: {
        position: "absolute",
        bottom: 56, // altura del toolbar base
        left: 0,
        right: 0,
    },
});