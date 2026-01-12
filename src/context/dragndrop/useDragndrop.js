import { useContext } from 'react';
import { DragndropContext } from './DragndropContext';

export const useDragndrop = () => {
    return useContext(DragndropContext);
};