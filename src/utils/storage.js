import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'appData';

/**
 * Lee el estado completo de la app desde AsyncStorage
 */
export const getAppData = async () => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : {};
    } catch (e) {
        console.log('Error reading storage', e);
        return {};
    }
};

/**
 * Guarda un fragmento de datos (parcial)
 */
export const saveAppData = async (partialData) => {
    try {
        const current = await getAppData();
        const updated = { ...current, ...partialData };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.log('Error saving storage', e);
    }
};

/**
 * Limpia todo el almacenamiento
 */
export const clearAppData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
};