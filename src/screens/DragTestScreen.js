import { View, Text } from 'react-native';
import {
    DragndropStartPoint,
    DragndropEndPoint,
    DragndropDragContent,
} from '../components/dragndrop';

export default function DragTestScreen() {
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
                Arrastra el cuadrado rojo hasta la zona azul
            </Text>

            {/* ORIGEN */}
            <DragndropStartPoint data={{ color: 'red' }}>
                <View
                    style={{
                        width: 80,
                        height: 80,
                        backgroundColor: 'red',
                        borderRadius: 8,
                    }}
                />
            </DragndropStartPoint>

            {/* DESTINO */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <DragndropEndPoint
                    onDrop={(data) => {
                        alert(`Drop correcto: ${data.color}`);
                    }}
                >
                    <View
                        style={{
                            height: 120,
                            backgroundColor: '#4da6ff',
                            borderRadius: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16 }}>
                            Suelta aquí
                        </Text>
                    </View>
                </DragndropEndPoint>
            </View>

            {/* CONTENIDO QUE SE ARRASTRA */}
            <DragndropDragContent>
                <View
                    style={{
                        width: 80,
                        height: 80,
                        backgroundColor: 'red',
                        opacity: 0.8,
                        borderRadius: 8,
                    }}
                />
            </DragndropDragContent>
        </View>
    );
}
