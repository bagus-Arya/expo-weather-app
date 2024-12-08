import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { fetchMachineLogs, LogMachine } from '@/services/apiLogRains'; // Adjust the import path as necessary

export default function RekapHujan() {
  const [weatherDataArray, setWeatherDataArray] = useState<LogMachine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await fetchMachineLogs();
        // setWeatherDataArray(data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {weatherDataArray.map((machineData) => (
          <View key={machineData.id} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.temperature}>{machineData.suhu} °C</Text>
                <Text style={styles.condition}>{machineData.kondisi_baik ? 'Cerah' : 'Hujan'}</Text>
                <Text style={styles.statistic}>Humidity: {machineData.kelembaban} %</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.tanggal}>{new Date(machineData.created_at).toLocaleDateString()}</Text>
                <Text style={styles.waktu}>{new Date(machineData.created_at).toLocaleTimeString()}</Text>
                <Text style={styles.statistic}>Wind: {machineData.kecepatan_angin} km/h</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#040424',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#040424',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
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
    marginBottom: 15,
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
  condition: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  tanggal: {
    color: '#FFD700',
    fontSize: 12,
    marginVertical: 1,
  },
  waktu: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  statistic: {
    color: '#FFFFFF',
    fontSize: 12,
    marginVertical: 1,
  },
});