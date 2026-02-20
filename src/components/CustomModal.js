import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CustomModal({
    visible,
    title,
    description,
    inputValue,
    onChangeText,
    onCancel,
    onSave,
}) {
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onCancel}
        >
            {/* Zona oscura de fondo */}
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    {/* Detenemos la propagación del toque al cuadro */}
                    <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.text}>{description}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Escribe el título..."
                                placeholderTextColor={theme.muted}
                                value={inputValue}
                                onChangeText={onChangeText}
                            />
                            <View style={styles.buttons}>
                                <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.save]} onPress={onSave}>
                                    <Text style={styles.buttonText}>Guardar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modal: {
        width: '80%',
        backgroundColor: theme.bg,
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.text
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: theme.textSecondary
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancel: {
        backgroundColor: theme.bg,
    },
    save: {
        backgroundColor: theme.bg,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});