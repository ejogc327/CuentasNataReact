import { useState, useEffect, useRef, useCallback } from 'react';
import { Keyboard } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, findNodeHandle, UIManager, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getAppData, saveAppData } from '../utils/storage';
import ScreenHeader from '../components/ScreenHeader';
import AccountToolbar from '../components/AccountToolbar';
import { Ionicons } from '@expo/vector-icons';
import { DragndropStartPoint, DragndropEndPoint, DragndropDragContent } from '../components/dragndrop';
import { useDragndrop } from '../context/dragndrop/useDragndrop';
import { useTheme } from '../context/ThemeContext';

const ITEM_HEIGHT = 40;
const SCROLL_THRESHOLD = 100; // Píxeles desde el borde para activar scroll
const SCROLL_SPEED = 10; // Velocidad del auto-scroll

export default function AccountScreen({ route, navigation }) {
    const { id, title: initialTitle } = route.params;
    const [title, setTitle] = useState(initialTitle);
    const [accounts, setAccounts] = useState([]);

    const [moveMode, setMoveMode] = useState(false);
    const [calendarMode, setCalendarMode] = useState(false);
    const [datePickerItemId, setDatePickerItemId] = useState(null);
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
            if (data.accounts?.[id]) {
                setAccounts(data.accounts[id].items || []);
                setTitle(data.accounts[id].title || initialTitle);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!id) return;
        const save = async () => {
            const data = await getAppData();
            const updatedAccounts = {
                ...data.accounts,
                [id]: { title, items: accounts }
            };
            await saveAppData({ accounts: updatedAccounts });
        };
        save();
    }, [accounts, title]);

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
                }, 16);
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
                if (id === draggedData.id) return false;
                return currentY >= rect.y && currentY <= rect.y + rect.height;
            });

            if (!target) return;

            const targetIndex = accounts.findIndex(i => i.id === target[0]);
            const draggedIndex = accounts.findIndex(i => i.id === draggedData.id);
            
            // Evitar reordenar si ya está en esa posición
            if (targetIndex === -1 || draggedIndex === -1 || targetIndex === lastTargetIndex.current) {
                return;
            }

            lastTargetIndex.current = targetIndex;

            // Intercambia los items
            setAccounts(prevAccounts => {
                const newAccounts = [...prevAccounts];
                const [removed] = newAccounts.splice(draggedIndex, 1);
                newAccounts.splice(targetIndex, 0, removed);
                return newAccounts;
            });
        });

        return () => {
            if (pos && pos.y) {
                pos.y.removeListener(listenerId);
            }
        };
    }, [moveMode, draggedData, dragging, accounts, pos]);

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

    const addAccount = () => {
        setAccounts([...accounts, { 
            id: Date.now().toString(), 
            text: '', 
            value: '', 
            checked: false, 
            include: true,
            date: new Date().toISOString(),
        }]);
    };

    const toggleItem = (id) => {
        if (moveMode) return; // no hacer nada
        setAccounts(accounts.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    const removeItem = (id) => {
        setAccounts(accounts.filter(i => i.id !== id));
    };

    const updateAccount = (id, field, value) => {
        setAccounts(accounts.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
    };

    const handleMoveItems = () => {
        setMoveMode(prev => !prev);
    };

    const handleConfirm = () => {
        setMoveMode(false);
    };
    
    const handleDelete = () => {
        setAccounts(prev => prev.filter(acc => !acc.checked));
    }

    const handleCalendar = () => {
        setCalendarMode(prev => !prev);
    }

    const handlePlusMinus = () => {
        setAccounts(prev => prev.map(acc => 
            acc.checked ? { ...acc, value: String(parseFloat(acc.value) * -1 || 0) } : acc
        ));
    }    

    const handleDragStart = useCallback((item) => {
        setDraggedItemId(item.id);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedItemId(null);
        lastTargetIndex.current = null;
    }, []);

    const renderItem = ({ item }) => {
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
                {calendarMode && (
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setDatePickerItemId(item.id)}
                        disabled={moveMode}
                    >
                        <Text style={styles.dateText}>
                            {item.date 
                                ? new Date(item.date).toLocaleDateString() 
                                : '--/--/--'}
                        </Text>
                    </TouchableOpacity>
                )}
                {moveMode ? (
                    <DragndropStartPoint 
                        data={item} 
                        handleOnly={true}
                        onDragStarted={handleDragStart}
                        onDragEnded={handleDragEnd}
                    >
                        <View style={styles.dragHandle}>
                            <Ionicons name="reorder-three-outline" size={24} color="#999"/>
                        </View>
                    </DragndropStartPoint>
                ) : (
                    <Checkbox value={item.checked} onValueChange={() => toggleItem(item.id)} />
                )}
                                
                <TextInput
                    style={styles.textInput}
                    placeholder="..."
                    placeholderTextColor={theme.muted}
                    value={item.text}
                    onChangeText={(t) => updateAccount(item.id, 'text', t)}
                    editable={!moveMode}
                    pointerEvents={moveMode ? 'none' : 'auto'}
                />
                
                <TextInput
                    style={styles.numInput}
                    placeholder="0"
                    placeholderTextColor={theme.muted}
                    keyboardType="numeric"
                    value={String(item.value)}
                    onChangeText={(v) => updateAccount(item.id, 'value', v)}
                    editable={!moveMode}
                    pointerEvents={moveMode ? 'none' : 'auto'}
                    selectTextOnFocus={true}
                />
                
                {!moveMode && (
                    <Checkbox
                        value={item.include}
                        onValueChange={(v) => updateAccount(item.id, 'include', v)}
                        disabled={moveMode}
                    />
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
                        if (containerRef.current) {
                            containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                                setContainerOffset({ x: pageX, y: pageY });
                            });
                        }
                    }}
                >
                    <TouchableOpacity onPress={addAccount} style={styles.addButton} >
                        <Text style={styles.addText}>＋ Añadir cuenta</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={accounts}
                        keyExtractor={(i) => i.id}
                        scrollEnabled={true}
                        renderItem={renderItem}
                        simultaneousHandlers={moveMode ? undefined : null}
                    />
                    <DateTimePickerModal
                        isVisible={datePickerItemId !== null}
                        mode="date"
                        onConfirm={(date) => {
                            updateAccount(datePickerItemId, 'date', date.toISOString());
                            setDatePickerItemId(null);
                        }}
                        onCancel={() => setDatePickerItemId(null)}
                    />
                    {moveMode && draggedData  && containerOffset && (
                        <DragndropDragContent containerOffset={containerOffset}>
                            <View 
                                style={[
                                    styles.itemRow, 
                                    styles.ghostItem,
                                    { 
                                        backgroundColor: draggedData.checked ? theme.border : theme.card,
                                        width: Dimensions.get('window').width - 40, // Ancho total menos padding (20 * 2)
                                    }
                                ]}
                            >
                                <View style={styles.dragHandle}>
                                    <Ionicons name="reorder-three-outline" size={22} color="#ccc" />
                                </View>
                                {/* <Checkbox value={draggedData.checked} disabled /> */}
                                <Text 
                                    style={[styles.textInput]} 
                                    numberOfLines={1}
                                >
                                    {draggedData.text || '...'}
                                </Text>
                                <Text style={styles.numInput}>
                                    {draggedData.value || '0'}
                                </Text>
                                {/* <Checkbox value={draggedData.include} disabled /> */}
                            </View>
                        </DragndropDragContent>
                    )}
                </View>
                <View style={styles.totalBar}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                        {accounts
                            .filter(acc => acc.include)
                            .reduce((sum, acc) => sum + (parseFloat(acc.value) || 0), 0)
                            .toFixed(2)}
                    </Text>
                </View>
                <AccountToolbar 
                    style={styles.toolbarWrapper}
                    onAdd={addAccount}
                    onMove={handleMoveItems}
                    onConfirm={handleConfirm}
                    moveMode={moveMode}
                    calendarMode={calendarMode}
                    onDelete={handleDelete}
                    onCalendar={handleCalendar}
                    onPlusMinus={handlePlusMinus}
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
    addButton: {
        display: 'none', // esconder por ahora
        marginLeft: 10, 
        backgroundColor: '#4CAF50', 
        borderRadius: 10,
        paddingHorizontal: 10, 
        paddingVertical: 8, 
        alignItems: 'center', 
    },
    addText: {
        color: '#fff', 
        fontSize: 16 
    },
    itemRow: {
        height: ITEM_HEIGHT,
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 4, // 🔥 Aumentado para mejor padding
        paddingVertical: 2, 
        backgroundColor: '#eee', // 🔥 Background por defecto
    },
    dropdown: { 
        marginRight: 10,
        width: 30,
        alignItems: 'center',
    },
    dragHandle: {
        width: 44,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    textInput: {
        flex: 1, 
        paddingHorizontal: 4, 
        marginHorizontal: 2, 
        fontSize: 14,
        paddingBottom: 8,
        color: theme.text,
    },
    numInput: {
        width: 50, 
        paddingHorizontal: 6, 
        paddingRight: 4,
        textAlign: 'right',
        fontSize: 14, 
        marginRight: 6,
        color: theme.text,
    },
    ghostItem: {
        opacity: 0.8,
        backgroundColor: '#eee',
    },
    toolbarWrapper: {
        height: 56,
        minHeight: 56,
        maxHeight: 56,
        overflow: 'hidden',
    },
    totalBar: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: theme.bg,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.text,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.textTotal,
    },
    dateInput: {
        width: 66,
        paddingVertical: 4,
        marginRight: 6,
        justifyContent: 'center',
    },
    dateText: {
        fontSize: 12,
        color: theme.muted
    },
});