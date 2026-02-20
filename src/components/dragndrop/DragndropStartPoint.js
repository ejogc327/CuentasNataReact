import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDragndrop } from '../../context/dragndrop/useDragndrop';

export const DragndropStartPoint = ({ children, data, handleOnly = false, onDragStarted, onDragEnded }) => {
    const { pos, onDragStart, onDragEnd } = useDragndrop();

    const dragGesture = Gesture.Pan()
        .minDistance(0) // 🔥 Sin distancia mínima
        .activateAfterLongPress(0)
        .onStart((evt) => {
            const { absoluteX, absoluteY, x, y } = evt;

            //Guarda posición del dedo
            pos.x.setValue(absoluteX);
            pos.y.setValue(absoluteY);

            // Guarda el offset relativo donde tocaste dentro del elemento
            onDragStart({
                ...data,
                offsetX: x, // ← Distancia del toque a la esquina izquierda del elemento
                offsetY: y, // ← Distancia del toque a la esquina superior del elemento
            });
            onDragStarted?.(data);
        })
        .onUpdate((evt) => {
            const { absoluteY } = evt;
            pos.y.setValue(absoluteY);
        })
        .onEnd(() => {
            const convert = (value) => Number(JSON.stringify(value));
            onDragEnd({
                x: convert(pos.x),
                y: convert(pos.y),
            });
            onDragEnded?.();
        })
        .runOnJS(true);

    return (
        <GestureDetector gesture={dragGesture}>
            {children}
        </GestureDetector>
    );
};
