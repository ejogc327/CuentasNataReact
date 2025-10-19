import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SelectionToolbar({ selectedCount, onClear, onAction }) {
    //if (selectedCount === 0) return null;

    return (
        <View style={styles.toolbar}>
            <View style={styles.leftGroup}>
                <TouchableOpacity onPress={onClear}>
                    <Text style={styles.clearText}>❌ Clear</Text>
                </TouchableOpacity>
                <Text style={styles.count}>{selectedCount}</Text>
            </View>
            <View style={styles.rightGroup}>
                <TouchableOpacity onPress={() => onAction('A')}>
                    <Text style={styles.icon}>⚙️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAction('B')}>
                    <Text style={styles.icon}>⚙️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAction('C')}>
                    <Text style={styles.icon}>⚙️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clearText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  icon: {
    fontSize: 18,
  },
});