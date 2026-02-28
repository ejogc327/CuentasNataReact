import { useState, useEffect } from 'react';
import { View, Text, Modal, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAppData, saveAppData } from '../utils/storage';
import HomeToolbar from '../components/HomeToolbar';
import SelectionToolbar from '../components/SelectionToolbar';
import CustomModal from '../components/CustomModal';
import ListItem from '../components/ListItem';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
    const [items, setItems] = useState([]); // Lista de items
    const [modalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [currentButton, setCurrentButton] = useState('');
    const [inputText, setInputText] = useState('');
    const [selectionMode, setSelectionMode] = useState(false);
    const [pages, setPages] = useState([
        { id: '1', title: 'Notas', type: 'note' },
        { id: '2', title: 'Listas', type: 'list' },
        { id: '3', title: 'Cuentas', type: 'account' },
    ]);
    
    const { theme } = useTheme();
    const styles = makeStyles(theme);

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

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const data = await getAppData();
            if (data.homeItems) {
                setItems(data.homeItems);
            }
        });
        return unsubscribe;
    }, [navigation]);

    // Abrir el modal
    const handleButtonPress = (source, item) => {
        if (!item?.id) return;
        if (source === 'nota') navigation.navigate('Nota', { title: item.title, id: item.id });
        if (source === 'lista') navigation.navigate('Lista', { title: item.title, id: item.id });
        if (source === 'cuenta') navigation.navigate('Cuenta', { title: item.title, id: item.id });
        
    };

    // Abrir el modal
    const handleLeftButtonPress = (buttonName) => {
        setCurrentButton(buttonName);
        setInputText('');
        setModalVisible(true);
    };
    // Guardar el título
    const handleSave = () => {
        if (!inputText.trim()) return;

        const newId = Date.now().toString(); // ID único
        const newItem = {
            id: newId,
            title: inputText,
            source: currentButton,
            checked: false
        };

        // Guardar en el estado
        setItems((prev) => [...prev, newItem]);

        // Cerrar modal
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
    }

    const handleClear = () => {
        setSelectionMode(false);
        setItems(items.map((i) => ({ ...i, checked: false })));
    }

    const handleAction = (type) => {
        switch (type) {
            case 'copy': // Copiar
                copySelectedItems();
                break;
            case 'export': // Exportar JSON
                exportSelectedAsJSON();
                break;
            case 'remove': // Eliminar
                deleteSelectedItems();
                break;
            default:
                break;
        }
    }

    const selectedCount = items.filter((i) => i.checked).length;

    const getSelectedItems = () => items.filter(i => i.checked);

    const deleteSelectedItems = () => {
        setItems(items.filter(i => !i.checked));
        setSelectionMode(false);
    };
    
    const copySelectedItems = async () => {
        setItems(prev => {
            const selected = prev.filter(i => i.checked);
            if (!selected.length) return prev;

            const duplicated = selected.map(item => ({
                ...item,
                id: Date.now().toString() + Math.random(),
                checked: false
            }));

            return [
                ...prev.map(i => ({ ...i, checked: false })),
                ...duplicated
            ];
        });

        setSelectionMode(false);
    };

    const exportSelectedAsJSON = async () => {
        const selected = getSelectedItems();

        if (selected.length === 0) return;

        const json = JSON.stringify(selected, null, 2);
        await Clipboard.setStringAsync(json);

        handleClear();
    };

    const exportAllAsJSON = async () => {
        try {
            const data = await getAppData();
            const exportData = {
                app: "CuentasNata",
                version: 1,
                exportedAt: new Date().toISOString(),
                data: data
            };
            const json = JSON.stringify(exportData, null, 2);

            const date = new Date().toISOString().split('T')[0];
            const fileUri = FileSystem.documentDirectory + `backup-${date}.json`;

            await FileSystem.writeAsStringAsync(fileUri, json);

            await Sharing.shareAsync(fileUri);

        } catch (error) {
            console.error("Error exportando JSON:", error);
        }
    };

    const exportSelected = async (options) => {
        try {
            const fullData = await getAppData();

            const selectedData = {};

            if (options.lists) {
            selectedData.lists = fullData.lists;
            }

            if (options.settings) {
                selectedData.settings = fullData.settings;
            }

            if (options.categories) {
                selectedData.categories = fullData.categories;
            }

            const exportData = {
                app: "CuentasNata",
                version: 1,
                exportedAt: new Date().toISOString(),
                data: selectedData
            };

            const json = JSON.stringify(exportData, null, 2);

            const date = new Date().toISOString().split('T')[0];
            const fileUri = FileSystem.documentDirectory + `backup-${date}.json`;

            await FileSystem.writeAsStringAsync(fileUri, json);

            await Sharing.shareAsync(fileUri);

        } catch (error) {
            console.error(error);
        }
    };

    const importJSON = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const fileUri = result.assets?.[0]?.uri;

            if (!fileUri) {
                alert("No se pudo obtener el archivo");
                return;
            }

            const fileContent = await FileSystem.readAsStringAsync(fileUri);

            const parsedData = JSON.parse(fileContent);

            if (parsedData.app !== "CuentasNata") {
                alert("Este archivo no pertenece a la app");
                return;
            }

            const currentData = await getAppData();

            const mergedData = {
                ...currentData,
                ...parsedData.data, // solo sobreescribe lo que venga en el backup
            };

            await saveAppData(mergedData);

            if (mergedData.homeItems) {
                setItems(mergedData.homeItems);
            }

            alert("Importación completada");
        } catch (error) {
            console.error("Error importando JSON:", error);
            alert("El archivo no es válido o está corrupto");
        }
    };

    return (
        <SafeAreaView style={ styles.safeArea } edges={['top', 'left', 'right', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notepad</Text>
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                        <Ionicons name="ellipsis-vertical" size={24} color={theme.text}/>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={menuVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableOpacity 
                        style={styles.menuOverlay} 
                        onPress={() => setMenuVisible(false)}
                    >
                        <View style={styles.menuContainer}>
                            {[
                                { label: 'Seleccionar', action: () => { setSelectionMode(true); setMenuVisible(false); } },
                                { label: 'Exportar todo JSON', action: () => { exportAllAsJSON(); setMenuVisible(false); } },
                                { label: 'Importar JSON', action: () => { importJSON(); setMenuVisible(false); } },
                                { label: 'Configuración', action: () => { navigation.navigate('Settings'); setMenuVisible(false); } },
                                { label: 'Acerca de...', action: () => setMenuVisible(false) },
                            ].map((option) => (
                                <TouchableOpacity 
                                    key={option.label} 
                                    style={styles.menuItem} 
                                    onPress={option.action}
                                >
                                    <Ionicons name={option.icon} size={20} color="#333" style={{ marginRight: 12 }} />
                                    <Text style={styles.menuItemText}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>
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
                            onPress={() => handleButtonPress(item.source, item)}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.empty}>Aún no hay títulos guardados</Text>
                    }
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

const makeStyles = (theme) => StyleSheet.create({
    safeArea: {        
        flex: 1,
        backgroundColor: theme.bg,
    },
    container: {
        flex: 1,
    },
    empty: {
        textAlign: 'center',
        color: theme.text,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: theme.muted,
        color: theme.text
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text,
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    menuContainer: {
        backgroundColor: theme.bg,
        borderRadius: 12,
        marginTop: 60,
        marginRight: 16,
        paddingVertical: 8,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuItemText: {
        fontSize: 15,
        color: theme.text
    },
});