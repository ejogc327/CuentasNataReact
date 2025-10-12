import { View, Text, Button, StyleSheet } from 'react-native';
import BottomToolbar from '../components/BottomToolbar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <Text style={styles.title}>Pantalla de inicio 🏠</Text>
            <Button
                title="Ir a detalles"
                onPress={() => navigation.navigate('Details')}
            />

            {/* Barra inferior */}
            <View style={styles.toolbarContainer}>
                <BottomToolbar />
            </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between', // empuja el toolbar abajo
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 100,
    },
    toolbarContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
});