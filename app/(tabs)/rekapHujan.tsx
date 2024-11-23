import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

export default function rekapHujan() {
  // Sample weather data array with statistics
  const weatherDataArray = [
    {
      tanggal: '24 November 2024',
      temperature: '25',
      condition: 'Cerah',
      waktu: '18:00',
      humidity: '60', // Added humidity
      windSpeed: '15', // Added wind speed
    },
    {
      tanggal: '25 November 2024',
      temperature: '22',
      condition: 'Hujan',
      waktu: '19:00',
      humidity: '80', // Added humidity
      windSpeed: '10', // Added wind speed
    },
    {
      tanggal: '26 November 2024',
      temperature: '27',
      condition: 'Cerah Berawan',
      waktu: '20:00',
      humidity: '55', // Added humidity
      windSpeed: '20', // Added wind speed
    },
    // Add more entries as needed
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {weatherDataArray.map((weatherData, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.temperature}>{weatherData.temperature} °C</Text>
                <Text style={styles.condition}>{weatherData.condition}</Text>
                <Text style={styles.statistic}>Humidity: {weatherData.humidity} %</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.tanggal}>{weatherData.tanggal}</Text>
                <Text style={styles.waktu}>{weatherData.waktu}</Text>
                <Text style={styles.statistic}>Wind: {weatherData.windSpeed} km/h</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040424',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#08c2ff',
    borderRadius: 10, // Border radius
    height: 100, // Increased height to accommodate additional text
    padding: 10, // Reduced padding
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15, // Spacing between cards
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%', // Make sure it takes full height of the card
  },
  leftColumn: {
    flex: 1,
    alignItems: 'flex-start', // Align items to the left
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end', // Align items to the right
  },
  temperature: {
    color: '#FFD700',
    fontSize: 24, // Reduced font size
    fontWeight: 'bold',
    marginVertical: 2, // Reduced margin
  },
  condition: {
    color: '#FFFFFF',
    fontSize: 14, // Reduced font size
  },
  tanggal: {
    color: '#FFD700',
    fontSize: 12, // Reduced font size
    marginVertical: 1, // Reduced margin
  },
  waktu: {
    color: '#FFFFFF',
    fontSize: 12, // Reduced font size
  },
  statistic: {
    color: '#FFFFFF',
    fontSize: 12, // Font size for statistics
    marginVertical: 1, // Margin for statistics
  },
});