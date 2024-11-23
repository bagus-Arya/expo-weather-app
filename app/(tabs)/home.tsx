import React, { useRef } from 'react';
import { Text, View, StyleSheet, Image, Animated } from 'react-native';

export default function Home() {
  // Sample weather data
  const weatherData = {
    location: 'Denpasar',
    temperature: '25',
    condition: 'Cerah',
    windSpeed: '10 km/h',
    humidity: '60%',
    airPressure: '1013 hPa',
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
        <Text style={styles.temperature}>{weatherData.temperature} °C</Text>
        <Text style={styles.condition}>{weatherData.condition}</Text>
        
        {/* New Weather Data in a horizontal layout */}
        <View style={styles.weatherRow}>
          <View style={styles.weatherDetailContainer}>
          <Text style={styles.weatherText}>Kecepatan Angin</Text>
            <Text style={styles.weatherDetail}>{weatherData.windSpeed}</Text>
          </View>
          <View style={styles.weatherDetailContainer}>
          <Text style={styles.weatherText}>Kelembaban</Text>
            <Text style={styles.weatherDetail}>{weatherData.humidity}</Text>
          </View>
          <View style={styles.weatherDetailContainer}>
          <Text style={styles.weatherText}>Tekanan Udara</Text>
            <Text style={styles.weatherDetail}>{weatherData.airPressure}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040424',
  },
  card: {
    backgroundColor: '#08c2ff',
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
  weatherRow: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Space out the items evenly
    width: '100%', // Ensure it takes the full width of the card
    marginTop: 20, // Add some margin for spacing
  },
  weatherDetailContainer: {
    flex: 1, // Allow each detail to take equal space
    alignItems: 'center', // Center the text within each detail
  },
  weatherDetail: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center', // Center the text
  },
  weatherText: {
    color: '#FFFFFF',
    fontSize: 11,
    textAlign: 'center', // Center the text
  },
});