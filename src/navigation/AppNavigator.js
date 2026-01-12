import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NoteScreen from '../screens/NoteScreen';
import ListScreen from '../screens/ListScreen';
import AccountScreen from '../screens/AccountScreen';
import DragFlatListScreen from '../screens/DragFlatListScreen';
import DragScreenWrapper from '../components/dragndrop/DragScreenWrapper';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Notepad' }} />
                <Stack.Screen name="Nota" component={NoteScreen} options={{title: 'Nota', headerShown: false }} />
                <Stack.Screen name="Cuenta" component={AccountScreen} options={{title: 'Cuenta', headerShown: false  }} />
                {/* <Stack.Screen name="Lista" component={ListScreen} options={{title: 'Lista', headerShown: false  }} /> */}
                <Stack.Screen name="Lista" options={{title: 'Lista', headerShown: false  }}>
                    {({ route, navigation }) => (
                        <DragScreenWrapper>
                            <ListScreen route={route} navigation={navigation} />
                        </DragScreenWrapper>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}