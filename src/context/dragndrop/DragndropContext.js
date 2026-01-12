import { ReactNode, createContext, useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';

export const DragndropContext = createContext({});

export const DragndropContextProvider = ({ children }) => {
    const [data, setData] = useState();
    const [dragging, setDragging] = useState(false);
    const [dropPos, setDropPos] = useState();

    const pos = useRef({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
    }).current;

    const onDragStart = useCallback((data) => {
        setData(data);
        setDragging(true);
    }, []);

    const onDragEnd = useCallback((pos) => {
        setDropPos(pos);
        setDragging(false);
    }, []);

    const value = {
        data,
        pos,
        dropPos,
        dragging,
        onDragStart,
        onDragEnd,
    };

    return (
        <DragndropContext.Provider value={value}>
            {children}
        </DragndropContext.Provider>
    );
};