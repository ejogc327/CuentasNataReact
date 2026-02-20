import { useState, useEffect, useRef, useCallback } from 'react';
import { Keyboard } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, findNodeHandle, UIManager, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import { getAppData, saveAppData } from '../utils/storage';
import ScreenHeader from '../components/ScreenHeader';
import ListToolbar from '../components/ListToolbar';
import { Ionicons } from '@expo/vector-icons';
import { DragndropStartPoint, DragndropEndPoint, DragndropDragContent } from '../components/dragndrop';
import { useDragndrop } from '../context/dragndrop/useDragndrop';
import { useTheme } from '../context/ThemeContext';

const ITEM_HEIGHT = 40;
const SCROLL_THRESHOLD = 100; // Píxeles desde el borde para activar scroll
const SCROLL_SPEED = 10; // Velocidad del auto-scroll

export default function ListScreen({ route, navigation }) {
    const { id, title: initialTitle } = route.params;
    const [title, setTitle] = useState(initialTitle);
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    const [moveMode, setMoveMode] = useState(false);
    const [listHeight, setListHeight] = useState(0);
    const [containerOffset, setContainerOffset] = useState({ x: 0, y: 0 });
    const [draggedItemId, setDraggedItemId] = useState(null);
    
    const itemRects = useRef({});
    const flatListRef = useRef(null);
    const scrollInterval = useRef(null);
    const containerRef = useRef(null);
    const lastTargetIndex = useRef(null);
    const { dropPos, data: draggedData, dragging, setContainerOffset: setContextOffset, pos } = useDragndrop();

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const { theme } = useTheme();
    const styles = makeStyles(theme);

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

    // 🔥 Auto-scroll cuando arrastras cerca de los bordes
    useEffect(() => {
        if (!moveMode || !dragging || !dropPos) {
            if (scrollInterval.current) {
                clearInterval(scrollInterval.current);
                scrollInterval.current = null;
            }
            return;
        }

        // Detectar si está cerca del borde superior o inferior
        const isNearTop = dropPos.y < SCROLL_THRESHOLD;
        const isNearBottom = dropPos.y > listHeight - SCROLL_THRESHOLD;

        if (isNearTop || isNearBottom) {
            if (!scrollInterval.current) {
                scrollInterval.current = setInterval(() => {
                    if (flatListRef.current) {
                        flatListRef.current.scrollToOffset({
                            offset: Math.max(0, flatListRef.current._listRef._scrollMetrics.offset + (isNearTop ? -SCROLL_SPEED : SCROLL_SPEED)),
                            animated: false,
                        });
                    }
                }, 16); // ~60fps
            }
        } else {
            if (scrollInterval.current) {
                clearInterval(scrollInterval.current);
                scrollInterval.current = null;
            }
        }

        return () => {
            if (scrollInterval.current) {
                clearInterval(scrollInterval.current);
                scrollInterval.current = null;
            }
        };
    }, [moveMode, dragging, dropPos, listHeight]);

    // 🔥 Intercambio en tiempo real mientras arrastras
    useEffect(() => {
        if (!moveMode || !draggedData || !dragging) {
            return;
        }

        // Listener para detectar cambios en pos.y
        const listenerId = pos.y.addListener(({ value }) => {
            const currentY = value;
            
            // Encuentra sobre qué item está el cursor
            const target = Object.entries(itemRects.current).find(([id, rect]) => {
                if (id === draggedData.id) return false; // Ignorar el item arrastrado
                return currentY >= rect.y && currentY <= rect.y + rect.height;
            });

            if (!target) return;

            const targetIndex = items.findIndex(i => i.id === target[0]);
            const draggedIndex = items.findIndex(i => i.id === draggedData.id);
            
            // Evitar reordenar si ya está en esa posición
            if (targetIndex === -1 || draggedIndex === -1 || targetIndex === lastTargetIndex.current) {
                return;
            }

            lastTargetIndex.current = targetIndex;

            // Intercambia los items
            setItems(prevItems => {
                const newItems = [...prevItems];
                const [removed] = newItems.splice(draggedIndex, 1);
                newItems.splice(targetIndex, 0, removed);
                return newItems;
            });
        });

        return () => {
            if (pos && pos.y) {
                pos.y.removeListener(listenerId);
            }
        };
    }, [moveMode, draggedData, dragging, items, pos]);

    // Para reemplazar el keyboard
    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

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

    const handleDragStart = useCallback((item) => {
        setDraggedItemId(item.id);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedItemId(null);
        lastTargetIndex.current = null;
    }, []);

    const renderItem = ({ item }) => {
        // 🔥 Ocultar el item que se está arrastrando
        const isDragging = draggedItemId === item.id;

        const itemContent = (
            <View
                style={[
                    styles.itemRow, 
                    { 
                        backgroundColor: item.checked ? theme.card : theme.bg,
                        opacity: isDragging ? 0 : 1, // 🔥 Ocultar cuando se arrastra
                    }
                ]}
                ref={ref => {
                    if (ref && moveMode) {
                        const handle = findNodeHandle(ref);
                        if (handle) {
                            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                                itemRects.current[item.id] = { x: pageX, y: pageY, width, height };
                            });
                        }
                    }
                }}
            >
                {moveMode ? (
                    <DragndropStartPoint 
                        data={item} 
                        handleOnly={true}
                        onDragStarted={handleDragStart} // 🔥 Callback
                        onDragEnded={handleDragEnd} // 🔥 Callback
                    >
                        <View style={styles.dragHandle}>
                            <Ionicons name="reorder-three-outline" size={24} color={theme.muted}/>
                        </View>
                    </DragndropStartPoint>
                ) : (
                    <Checkbox value={item.checked} onValueChange={() => toggleItem(item.id)} />
                )}
                
                <TextInput
                    style={styles.itemText}
                    value={item.text}
                    placeholder="..."
                    placeholderTextColor={theme.textSecondary}
                    editable={!moveMode}
                    pointerEvents={moveMode ? 'none' : 'auto'}
                    onChangeText={text => updateItemText(item.id, text)}
                />
                
                {!moveMode && (
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <Ionicons name="close-circle-outline" size={26} color={theme.muted}/>
                    </TouchableOpacity>
                )}
            </View>
        );
        
        if (moveMode) {
            return (
                <DragndropEndPoint onDrop={() => {}} key={item.id}>
                    {itemContent}
                </DragndropEndPoint>
            );
        }
    
        return <View key={item.id}>{itemContent}</View>;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenHeader 
                navigation={navigation}
                icon="document-text-sharp"
                title={title}
                setTitle={setTitle}
            />
            <View style={[styles.keyboardArea, { paddingBottom: keyboardHeight }]}>
                <View 
                    style={styles.container}
                    ref={containerRef}
                    onLayout={() => {
                        // 🔥 Captura el offset del contenedor
                        if (containerRef.current) {
                            containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                                setContainerOffset({ x: pageX, y: pageY });
                            });
                        }
                    }}
                >
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nuevo ítem..."
                            placeholderTextColor={theme.textSecondary}
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
                        scrollEnabled={true}
                        renderItem={renderItem}
                        simultaneousHandlers={moveMode ? undefined : null}
                    />
                    {moveMode && draggedData  && containerOffset && (
                        <DragndropDragContent containerOffset={containerOffset}>
                            <View
                                style={[
                                    styles.itemRow,
                                    styles.ghostItem,
                                    { 
                                        backgroundColor: draggedData.checked ? theme.text : theme.card,
                                        width: Dimensions.get('window').width - 40, // Ancho total menos padding (20 * 2)
                                    }
                                ]}
                            >
                                <View style={styles.dragHandle}>
                                    <Ionicons name="reorder-three-outline" size={22} color={theme.muted} />
                                </View>
                                <Text 
                                    style={[styles.itemText]} 
                                    numberOfLines={1}
                                >
                                    {draggedData.text || '...'}
                                </Text>
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
            </View>
        </SafeAreaView>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    safeArea: {        
        flex: 1,
        backgroundColor: theme.bg,
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
        display: 'none', // esconder
        height: ITEM_HEIGHT,
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 4, // Aumentado para mejor padding
        paddingVertical: 2,
        backgroundColor: theme.bg, // Background por defecto
        color: theme.text
    },
    input: {
        flex: 1, 
        borderWidth: 1, 
        borderColor: '#ccc',
        borderRadius: 10, 
        padding: 8, 
        fontSize: 16,
        color: theme.text,
    },
    addButton: {
        marginLeft: 10, 
        backgroundColor: '#4CAF50',
        borderRadius: 10, 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
    },
    addText: { 
        color: theme.text, 
        fontSize: 20 
    },
    itemRow: {
        height: ITEM_HEIGHT,
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 1,
        backgroundColor: theme.bg,
    },
    dragHandle: {
        width: 44,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: { 
        flex: 1, 
        fontSize: 16,
        paddingBottom: 8,
        color: theme.text,
    },
    ghostItem: {
        opacity: 0.8,
        backgroundColor: theme.bg,
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