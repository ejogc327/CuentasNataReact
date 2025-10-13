import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';

export default function CustomModal({
    visible,
    title,
    description,
    inputValue,
    onChangeText,
    onCancel,
    onSave,
}) {
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modal: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
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
        backgroundColor: '#ccc',
    },
    save: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});