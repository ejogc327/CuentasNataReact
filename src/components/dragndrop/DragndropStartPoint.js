import { Animated } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDragndrop } from '../../context/dragndrop/useDragndrop';

export const DragndropStartPoint = ({ children, data }) => {
    const { pos, onDragStart, onDragEnd } = useDragndrop();

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            onDragStart(data);
        })
        .onUpdate((evt) => {
            const { absoluteX, absoluteY } = evt;
            pos.x.setValue(absoluteX);
            pos.y.setValue(absoluteY);
        })
        .onEnd(() => {
            const convert = (value) => Number(JSON.stringify(value));
            onDragEnd({
                x: convert(pos.x),
                y: convert(pos.y),
            });
        })
        .runOnJS(true);

    return (
        <GestureDetector gesture={dragGesture}>
            {children}
        </GestureDetector>
    );
};
