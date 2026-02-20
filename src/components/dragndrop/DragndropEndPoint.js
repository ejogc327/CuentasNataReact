import { Children, cloneElement, useEffect, useState } from 'react';
import { useDragndrop } from '../../context/dragndrop/useDragndrop';

export const DragndropEndPoint = ({ children, onDrop }) => {
    const { dropPos, data } = useDragndrop();
    const [rect, setRect] = useState(null);

    useEffect(() => {
        if (!dropPos || !rect || !onDrop || !data) return;

        const x2 = rect.x + rect.width;
        const y2 = rect.y + rect.height;

        if (
            dropPos.x >= rect.x &&
            dropPos.x <= x2 &&
            dropPos.y >= rect.y &&
            dropPos.y <= y2
        ) {
            onDrop(data);
        }
    }, [dropPos, rect, data, onDrop]);

    const newChildren = Children.map(children, (child) =>
        cloneElement(child, {
            onLayout: (evt) => {
                evt.target.measure(
                    (_x, _y, width, height, pageX, pageY) => {
                        setRect({ x: pageX, y: pageY, width, height });
                    }
                );
            },
        })
    );

    return newChildren;
};
