import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DragndropContextProvider } from '../../context/dragndrop/DragndropContext';

export default function DragScreenWrapper({ children }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DragndropContextProvider>
        {children}
      </DragndropContextProvider>
    </GestureHandlerRootView>
  );
}