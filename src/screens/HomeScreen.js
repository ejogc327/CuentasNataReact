import { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    // const [showCheckboxes, setShowCheckboxes] = useState(false);

    // Abrir el modal
    const handleButtonPress = (source) => {
        console.log("Presionando botón..." + source);
        if (source === 'nota') navigation.navigate('Nota', { title: pages.title });
        if (source === 'lista') navigation.navigate('Lista', { title: pages.title });
        if (source === 'cuenta') navigation.navigate('Cuenta', { title: pages.title });
        
    };

    // Abrir el modal
    const handleLeftButtonPress = (buttonName) => {
        //if (pages.type === 'note') navigation.navigate('Note', { title: item.title });
        //if (pages.type === 'list') navigation.navigate('List', { title: item.title });
        //if (pages.type === 'account') navigation.navigate('Account', { title: item.title });
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

            <SafeAreaView style={styles.safeArea}>
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
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between', // empuja el toolbar abajo
        marginLeft: 10,
        backgroundColor: '#f9f9f9',
    },
    empty: {
        textAlign: 'center',
        color: '#777',
        marginTop: 20,
    },
    safeArea: {        
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
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