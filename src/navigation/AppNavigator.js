import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NoteScreen from '../screens/NoteScreen';
import ListScreen from '../screens/ListScreen';
import AccountScreen from '../screens/AccountScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Inicio' }} />
                <Stack.Screen name="Nota" component={NoteScreen} options={{title: 'Nota' }} />
                <Stack.Screen name="Lista" component={ListScreen} options={{title: 'Lista' }} />
                <Stack.Screen name="Cuenta" component={AccountScreen} options={{title: 'Cuenta' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}