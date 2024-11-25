import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { fetchMachineLogs, LogMachine } from '@/services/apiLogMachine'; // Adjust the path as necessary

interface WeatherData {
  date: string;
  temperature: string;
  time: string;
  wind_speed: number;
  atmospheric_pressure: number;
  humidity: number;
}

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.temperature}>{weatherData.temperature}</Text>
          <Text style={styles.wind_speed}>Wind: {weatherData.wind_speed} km/h</Text>
          <Text style={styles.humidity}>Humidity: {weatherData.humidity}%</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.date}>{weatherData.date}</Text>
          <Text style={styles.time}>{weatherData.time}</Text>
          <Text style={styles.atmospheric_pressure}>Pressure: {weatherData.atmospheric_pressure} hPa</Text>
        </View>
      </View>
    </View>
  );
};

WeatherCard.propTypes = {
  weatherData: PropTypes.shape({
    date: PropTypes.string.isRequired,
    temperature: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    wind_speed: PropTypes.number.isRequired,
    atmospheric_pressure: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
  }).isRequired,
};

const Riwayat: React.FC = () => {
  const [machines, setMachines] = useState<LogMachine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const weatherDataArray: WeatherData[] = [
    {
      date: '24 November 2024',
      temperature: '25°C',
      time: '18:00',
      wind_speed: 30,
      atmospheric_pressure: 30,
      humidity: 24,
    },
    // ... other weather data entries
  ];

  useEffect(() => {
    const getMachineLogs = async () => {
      try {
        const fetchedMachines = await fetchMachineLogs();
        setMachines(fetchedMachines);
      } catch (err) {
        console.error('Error fetching machine logs:', err);
        setError('Failed to fetch machine logs');
      }
    };

    getMachineLogs();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {weatherDataArray.map((data, index) => (
          <WeatherCard key={index} weatherData={data} />
        ))}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        {machines.length > 0 ? (
          machines.map(machine => (
            <View key={machine.id} style={styles.card}>
              <Text style={styles.machineText}>Machine ID: {machine.machine_id}, Suhu: {machine.suhu}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No machines found.</Text>
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

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
    borderRadius: 10,
    height: 100, 
    padding: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  leftColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  temperature: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  date: {
    color: '#FFD700',
    fontSize: 12,
    marginVertical: 1,
  },
  time: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  wind_speed: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  atmospheric_pressure: {
    color: '#FFD700',
    fontSize: 12,
    marginVertical: 1,
  },
  humidity: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  machineText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  noDataText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default Riwayat;