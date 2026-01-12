import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, findNodeHandle, UIManager } from 'react-native';
import { DragndropStartPoint, DragndropEndPoint, DragndropDragContent } from '../components/dragndrop';
import { useDragndrop } from '../context/dragndrop/useDragndrop';

export default function DragFlatListScreen() {
    const [items, setItems] = useState([
        { id: '1', color: 'red' },
        { id: '2', color: 'green' },
        { id: '3', color: 'orange' },
        { id: '4', color: 'purple' },
    ]);

    const { dropPos, data: draggedData } = useDragndrop();
    const itemRects = useRef({});

    useEffect(() => {
        if (!dropPos || !draggedData) return;

        // Detectar sobre qué elemento cae
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
        <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Arrastra los cuadrados para reordenarlos
        </Text>

        <FlatList
            data={items}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
                <DragndropEndPoint onDrop={() => {}}>
                    <DragndropStartPoint data={item}>
                    <View
                        ref={ref => {
                            if (ref) {
                            const handle = findNodeHandle(ref);
                            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                                itemRects.current[item.id] = { x: pageX, y: pageY, width, height };
                            });
                            }
                        }}
                        style={[styles.item, { backgroundColor: item.color }]}
                    />
                    </DragndropStartPoint>
                </DragndropEndPoint>
            )}
        />

        <DragndropDragContent>
            <View style={styles.dragContent} />
        </DragndropDragContent>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 80,
        marginBottom: 12,
        borderRadius: 8,
    },
    dragContent: {
        width: 80,
        height: 80,
        backgroundColor: 'gray',
        borderRadius: 8,
        opacity: 0.8,
    },
});
