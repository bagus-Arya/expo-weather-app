import React, { useRef } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Animated } from 'react-native';

export default function Weather() {
  // Sample weather data
  const weatherData = {
    location: 'Denpasar',
    temperature: '25°C',
    condition: 'Cerah',
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const translateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100], 
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
        <Text style={styles.location}>{weatherData.location}</Text>
        <Image source={require('@/assets/images/tabs/Sun.png')} style={styles.icon} />
        <Text style={styles.temperature}>{weatherData.temperature}</Text>
        <Text style={styles.condition}>{weatherData.condition}</Text>
      </Animated.View>
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // Set to false for compatibility
        )}
      >
        <View style={styles.content}>
          <Text style={styles.contentText}>Scroll down for more content...</Text>
          {Array.from({ length: 20 }, (_, i) => (
            <Text key={i} style={styles.contentText}>Content Block {i + 1}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090821',
  },
  card: {
    backgroundColor: '#2E2E3A',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    position: 'absolute', 
    top: 0, 
    zIndex: 1, 
  },
  location: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    color: '#FFD700',
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  condition: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  icon: {
    width: 175,
    height: 100,
    marginBottom: 10,
  },
  scrollView: {
    marginTop: 200, // Adjust this to match the height of the card
  },
  content: {
    padding: 20,
  },
  contentText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginVertical: 10,
  },
});