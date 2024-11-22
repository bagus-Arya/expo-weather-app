import { Text, View,  StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.card}>
        <Text style={styles.text}>
          Home
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9ABF80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#89A8B2',
    borderRadius: 9,
    opacity: 0.6,
    padding: 100 
  },
  text: {
    color: '#000000',
  },
});