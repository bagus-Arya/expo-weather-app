import { Text, View,  StyleSheet } from 'react-native';

export default function RekapHujan() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rekap hujan</Text>
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