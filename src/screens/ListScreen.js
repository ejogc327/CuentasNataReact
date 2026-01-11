import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated, PanResponder, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import { getAppData, saveAppData } from '../utils/storage';
import ScreenHeader from '../components/ScreenHeader';
import ListToolbar from '../components/ListToolbar';
import { Ionicons } from '@expo/vector-icons';

const ITEM_HEIGHT = 56;

export default function ListScreen({ route, navigation }) {
    const { id, title: initialTitle } = route.params;
    const [title, setTitle] = useState(initialTitle);
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    const [moveMode, setMoveMode] = useState(false);
    
    const panY = useRef(new Animated.Value(0)).current;    
    const draggingIndex = useRef(null);
    const itemPositions = useRef([]); // para guardar la posición Y de cada item

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
        draggingIndex.current = -1;
        panY.setValue(0);
    }

    const handleConfirm = () => {
        setMoveMode(false);
        draggingIndex.current = -1;
    }

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => moveMode,
            onPanResponderGrant: (_, gesture) => {
                const scrollOffset = scrollViewRef.current?.scrollResponderScrollNativeHandleToKeyboard || 0;
                const index = Math.floor((gesture.y0 + scrollOffset - 20) / ITEM_HEIGHT);
                draggingIndex.current = index;
                panY.setValue(0);
            },
            onPanResponderMove: Animated.event(
                [null, { dy: panY }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture) => {
                if (draggingIndex.current === null) return;

                const from = draggingIndex.current;
                const to = from + Math.round(gesture.dy / ITEM_HEIGHT);

                if (to >= 0 && to < items.length && to !== from) {
                    const updated = [...items];
                    const [moved] = updated.splice(from, 1);
                    updated.splice(to, 0, moved);
                    setItems(updated);
                }

                panY.setValue(0);
                draggingIndex.current = null;
            },
        })
    ).current;

    const renderItem = (item, index) => {
        const isDragging = moveMode && draggingIndex.current === index;
        const top = panY.interpolate({
            inputRange: [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
            outputRange: [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View
                key={item.id}
                {...(moveMode ? panResponder.panHandlers : {})}
                style={[
                    styles.itemRow,
                    isDragging && { 
                        position: 'absolute',  // 🔥 importante
                        left: 0,
                        right: 0,
                        transform: [{ translateY: panY }],
                        zIndex: 10,
                        elevation: 10,
                        backgroundColor: '#fff',
                    },
                ]}
            >
                {moveMode && (
                    <Ionicons name="reorder-three-outline" size={22} color={moveMode ? '#ccc' : '#333'}/>
                )}
                {!moveMode && (
                    <Checkbox
                        value={item.checked}
                        onValueChange={() => toggleItem(item.id)}
                    />
                )}
                <TextInput
                    style={[
                        styles.itemText,
                        item.checked && { textDecorationLine: 'line-through' },
                        moveMode && { color: '#999' },
                    ]}
                    value={item.text}
                    onChangeText={(text) => updateItemText(item.id, text)}
                    placeholder="..."
                    editable={!moveMode}
                    multiline
                />
                {!moveMode && (
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <Ionicons name="close-circle-outline" size={26} color="#000"/>
                    </TouchableOpacity>
                )}
            </Animated.View>
        )
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
                    <ScrollView scrollEnabled={!moveMode}>
                        {items.map((item, index) => renderItem(item, index))}
                    </ScrollView>
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