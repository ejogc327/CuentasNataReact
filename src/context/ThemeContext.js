import { createContext, useContext, useState, useEffect } from 'react';
import { getAppData, saveAppData } from '../utils/storage';

export const themes = {
    light: {
        bg: '#f5f5f5',
        card: '#fff',
        text: '#111',
        placeholder: '#aaa',
        textSecondary: '#333',
        textTotal: '#4CAF50',
        muted: '#999',
        border: '#eee',
        headerBg: '#fff',
        blue: '#19f'
    },
    dark: {
        bg: '#1a1a1a',
        card: '#2a2a2a',
        text: '#f0f0f0',
        placeholder: '#888',
        textSecondary: '#eee',
        textTotal: '#4CAF50',
        muted: '#666',
        border: '#333',
        headerBg: '#2a2a2a',
        blue: '#19f'
    },
};

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await getAppData();
            setDarkMode(data.settings?.darkMode ?? false);
        };
        load();
    }, []);

    const toggleDarkMode = async (value) => {
        setDarkMode(value);
        const data = await getAppData();
        await saveAppData({ settings: { ...data.settings, darkMode: value } });
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme: darkMode ? themes.dark : themes.light }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);