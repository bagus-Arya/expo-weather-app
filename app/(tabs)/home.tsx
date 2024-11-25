import React, { useRef } from 'react';
import { Text, View, StyleSheet, Image, Animated, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Define the possible weather conditions
type WeatherCondition = 'Cerah' | 'Hujan' | 'Berawan';

interface WeatherData {
  location: string;
  temperature: string;
  condition: WeatherCondition;
  windSpeed: string;
  humidity: string;
  airPressure: string;
}

export default function Home() {
  // Sample weather data
  const weatherData: WeatherData = {
    location: 'Denpasar',
    temperature: '25',
    condition: 'Berawan', // Example condition
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

  // Function to determine the icon based on the condition
  const getWeatherIcon = (condition: WeatherCondition): any => {
    switch (condition) {
      case 'Cerah':
        return require('@/assets/images/tabs/Sun.png'); // Sunny
      case 'Hujan':
        return require('@/assets/images/tabs/Raining.png'); // Rainy
      case 'Berawan':
        return require('@/assets/images/tabs/Thunder.png'); // Cloudy
      default:
        return require('@/assets/images/tabs/Sun.png'); // Default to sunny
    }
  };

  // Sample data for the line graph
  const lineChartData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [
      {
        data: [25, 27, 26, 28, 30, 29, 31], // Sample temperature data
        strokeWidth: 2, // optional
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
        <Text style={styles.location}>{weatherData.location}</Text>
        <Image 
          source={getWeatherIcon(weatherData.condition)} 
          style={styles.icon} 
          resizeMode="contain" 
        />
        <Text style={styles.temperature}>{weatherData.temperature} °C</Text>
        <Text style={styles.condition}>{weatherData.condition}</Text>

        {/* Weather Details */}
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

      {/* Scrollable Forecast Cards */}
      <ScrollView 
        style={styles.forecastContainer} 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Hari Ini</Text>
          <Text style={styles.forecastTemperature}>27 °C</Text>
          <Text style={styles.forecastCondition}>Cerah</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Besok</Text>
          <Text style={styles.forecastTemperature}>24 °C</Text>
          <Text style={styles.forecastCondition}>Hujan</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Lusa</Text>
          <Text style={styles.forecastTemperature}>26 °C</Text>
          <Text style={styles.forecastCondition}>Berawan</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Hari Ini</Text>
          <Text style={styles.forecastTemperature}>27 °C</Text>
          <Text style={styles.forecastCondition}>Cerah</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Besok</Text>
          <Text style={styles.forecastTemperature}>24 °C</Text>
          <Text style={styles.forecastCondition}>Hujan</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Lusa</Text>
          <Text style={styles.forecastTemperature}>26 °C</Text>
          <Text style={styles.forecastCondition}>Berawan</Text>
        </View>
      </ScrollView>

      {/* Line Graph */}
      <View style={styles.graphContainer}>
        <LineChart
          data={lineChartData}
          width={350} // Adjust width as needed
          height={220}
          chartConfig={{
            backgroundColor: '#040424',
            backgroundGradientFrom: '#08c2ff',
            backgroundGradientTo: '#08c2ff',
            decimalPlaces: 1, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.lineChart}
        />
      </View>
    </ScrollView>
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
    marginBottom: 20,
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
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  weatherDetailContainer: {
    flex: 1,
    alignItems: 'center',
  },
  weatherDetail: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
  },
  weatherText: {
    color: '#FFFFFF',
    fontSize: 11,
    textAlign: 'center',
  },
  forecastContainer: {
    flexDirection: 'row', // Ensure children are arranged in a row
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%', // Ensure full width for scrolling
  },
  forecastCard: {
    backgroundColor: '#08c2ff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5, // Adjust margin for spacing between cards
    minWidth: 100, // Set a minimum width for each card
  },
  forecastText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastTemperature: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
  },
  forecastCondition: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  graphContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  lineChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});