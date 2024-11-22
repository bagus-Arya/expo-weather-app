import { Text, View,  StyleSheet } from 'react-native';

export default function Riwayat() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Riwayat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000',
  },
});