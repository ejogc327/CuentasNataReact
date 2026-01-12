import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, findNodeHandle, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import { getAppData, saveAppData } from '../utils/storage';
import ScreenHeader from '../components/ScreenHeader';
import ListToolbar from '../components/ListToolbar';
import { Ionicons } from '@expo/vector-icons';
import { DragndropStartPoint, DragndropEndPoint, DragndropDragContent } from '../components/dragndrop';
import { useDragndrop } from '../context/dragndrop/useDragndrop';

const ITEM_HEIGHT = 56;

export default function ListScreen({ route, navigation }) {
    const { id, title: initialTitle } = route.params;
    const [title, setTitle] = useState(initialTitle);
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    const [moveMode, setMoveMode] = useState(false);
    
    const itemRects = useRef({});
    const { dropPos, data: draggedData } = useDragndrop();

    useEffect(() => {
        const load = async () => {
            const data = await getAppData();
            if (data.lists?.[id]) {
                setItems(data.lists[id].items || []);
                setTitle(data.lists[id].title || initialTitle);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!id) return;

        const save = async () => {
            const current = await getAppData();
            const updatedLists = {
                ...current.lists,
                [id]: { title, items }
            };
            await saveAppData({ lists: updatedLists });
        };

        save();
    }, [items, title]);

    const addItem = () => {
        if (!text.trim()) return;
        const newId = Date.now().toString();
        const newItem = { id: newId, text: text, checked: false };
        setItems((prev) => [...prev, newItem]);
        setText('');
    };

    const toggleItem = (id) => {
        if (moveMode) return; // no hacer nada
        setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItemText = (id, text) => {
        setItems(prev =>
            prev.map(i =>
                i.id === id ? { ...i, text } : i
            )
        );
    };

    const handleAddItem = () => {
        const newItem = {
            id: Date.now().toString(),
            text: '',
            checked: false,
        };
        setItems(prev => [...prev, newItem]);
    }

    const handleMoveItems = () => {
        setMoveMode(prev => !prev);
    }

    const handleConfirm = () => {
        setMoveMode(false);
    }

    useEffect(() => {
        if (!dropPos || !draggedData) return;

        const target = Object.entries(itemRects.current).find(([id, rect]) => {
            const x2 = rect.x + rect.width;
            const y2 = rect.y + rect.height;
            return dropPos.x >= rect.x && dropPos.x <= x2 && dropPos.y >= rect.y && dropPos.y <= y2;
        });

        if (!target) return;

        const targetIndex = items.findIndex(i => i.id === target[0]);
        const draggedIndex = items.findIndex(i => i.id === draggedData.id);
        if (targetIndex === draggedIndex) return;

        const newItems = [...items];
        const [removed] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, removed);
        setItems(newItems);

    }, [dropPos]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenHeader 
                navigation={navigation}
                icon="document-text-sharp"
                title={title}
                setTitle={setTitle}
            />
            <KeyboardAvoidingView
                style={ styles.keyboardArea }
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
                        keyExtractor={item => item.id}
                        scrollEnabled={!moveMode}
                        renderItem={({ item }) => {
                            // Contenido del item
                            const content = (
                                <View
                                    style={[styles.itemRow, { backgroundColor: item.checked ? '#eee' : '#fff' }]}
                                    ref={ref => {
                                        if (ref) {
                                            const handle = findNodeHandle(ref);
                                            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                                                itemRects.current[item.id] = { x: pageX, y: pageY, width, height };
                                            });
                                        }
                                    }}
                                >
                                    {moveMode && (
                                        <Ionicons name="reorder-three-outline" size={22} color={moveMode ? '#ccc' : '#333'}/>
                                    )}
                                    { !moveMode && (
                                        <Checkbox value={item.checked} onValueChange={() => toggleItem(item.id)} />
                                    )}
                                    <TextInput
                                        style={styles.itemText}
                                        value={item.text}
                                        placeholder="..."
                                        editable={!moveMode}
                                        onChangeText={text => updateItemText(item.id, text)}
                                    />
                                    {!moveMode && (
                                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                                            <Ionicons name="close-circle-outline" size={26} color="#000"/>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                            // Solo usar drag & drop si moveMode = true
                            if (moveMode) {
                                return (
                                    <DragndropEndPoint onDrop={() => {}} key={item.id}>
                                        <DragndropStartPoint data={item}>
                                            {content}
                                        </DragndropStartPoint>
                                    </DragndropEndPoint>
                                );
                            } else {
                                return <View key={item.id}>{content}</View>
                            }
                        }}
                    />
                    {moveMode && draggedData && (
                        <DragndropDragContent>
                            <View
                                style={[
                                    styles.itemRow,
                                    { backgroundColor: draggedData.checked ? '#eee' : '#fff', width: '100%', opacity: 0.9,}
                                ]}
                            >
                                <Ionicons name="reorder-three-outline" size={22} color="#ccc" />
                                <TextInput
                                    style={styles.itemText}
                                    value={draggedData.text}
                                    editable={false} // no editable en ghost
                                />
                            </View>
                        </DragndropDragContent>
                    )}
                </View>
                <ListToolbar 
                    style={styles.toolbarWrapper} 
                    onAdd={handleAddItem} 
                    onMove={handleMoveItems} 
                    onConfirm={handleConfirm} 
                    moveMode={moveMode}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {        
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardArea: {
        flex: 1,
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
        height: ITEM_HEIGHT,
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8, 
        borderBottomWidth: 1, 
        borderColor: '#eee',
    },
    dropdown: { 
        marginRight: 10,

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

    toolbarWrapper: {
        height: 56,          // ALTURA REAL
        minHeight: 56,
        maxHeight: 56,
        overflow: 'hidden',  // 🔥 CLAVE
        backgroundColor: '#0e0',
    },
});