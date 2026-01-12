import { useState } from 'react';
import { Animated, View } from 'react-native';
import { useDragndrop } from '../../context/dragndrop/useDragndrop';

export const DragndropDragContent = ({ children }) => {
    const { pos, dragging } = useDragndrop();
    const [contentLayout, setContentLayout] = useState(null);

    if (!dragging) return null;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                zIndex: 1000,
            }}
        >
            <View
                onLayout={(layout) =>
                    setContentLayout(layout.nativeEvent.layout)
                }
                style={{
                    transform: [
                        {
                            translateX:
                                -((contentLayout?.width || 0) / 2),
                        },
                        {
                            translateY:
                                -((contentLayout?.height || 0) / 2),
                        },
                    ],
                }}
            >
                {children}
            </View>
        </Animated.View>
    );
};
