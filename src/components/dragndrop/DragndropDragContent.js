import { useState } from 'react';
import { Animated, View } from 'react-native';
import { useDragndrop } from '../../context/dragndrop/useDragndrop';

export const DragndropDragContent = ({ children, containerOffset }) => {
    const { pos, dragging, data } = useDragndrop();
    const [contentLayout, setContentLayout] = useState(null);

    if (!dragging) return null;

    // const halfHeight = (contentLayout?.height || 0) / 2;
    // const adjustedY = Animated.subtract(
    //     Animated.subtract(pos.y, containerOffset.y), 
    //     halfHeight
    // );

    // Usa el offset donde tocaste originalmente
    const offsetX = data?.offsetX || 0;
    const offsetY = data?.offsetY || 0;
    // Ajusta por el offset del contenedor
    const containerOffsetX = containerOffset?.x || 0;
    const containerOffsetY = containerOffset?.y || 0;
    // ⭐ Combinar todo en un solo valor numérico
    const adjustX = -(containerOffsetX + offsetX + 8);
    const adjustY = -(containerOffsetY + offsetY);

    return (
        <View
            pointerEvents="none"
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
            }}
        >
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transform: [
                        { translateX: Animated.add(pos.x, new Animated.Value(adjustX)) },
                        { translateY: Animated.add(pos.y, new Animated.Value(adjustY)) },
                    ],
                }}
            >
                {children}
            </Animated.View>
        </View>
    );
};