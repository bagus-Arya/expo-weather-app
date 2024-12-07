import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchMachineLogs, DeviceLog, DeviceLogsResponse } from '@/services/apiLogMachine';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Riwayat: React.FC = () => {
 
  const [machineId, setMachineId] = useState<string | null>(null);
  const [machines, setMachines] = useState<DeviceLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<{
    total: number;
    currentPage: number;
    lastPage: number;
  }>({
    total: 0,
    currentPage: 1,
    lastPage: 1
  });

  const fetchLogs = async (page: number = 1) => {
    if (!machineId) {
      setError('Machine ID is not available.');
      return;
    }

    try {
      setLoading(true);
      const response: DeviceLogsResponse = await fetchMachineLogs(Number(machineId), page);
      setMachines(response.data[0]?.device_logs || []); // Accessing device_logs from the first device
      setPagination({
        total: response.total,
        currentPage: response.current_page,
        lastPage: response.last_page
      });
    } catch (err) {
      console.error('Error fetching machine logs:', err);
      setError(`Failed to fetch machine logs: ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getMachineId = async () => {
      try {
        const id = await AsyncStorage.getItem('machineId');
        if (id !== null) {
          console.log("Riwayat id machine: "+id);
          setMachineId(id);
        } else {
          setError('No machineId found in local storage.');
        }
      } catch (err) {
        setError('Failed to retrieve machineId: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    };

    getMachineId();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.lastPage) {
      fetchLogs(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      fetchLogs(pagination.currentPage - 1);
    }
  };

  const renderMachineCard = (machine: DeviceLog) => (
    <View key={machine.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.machineIdText}>Machine ID: {machine.machine_id}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Temperature:</Text>
          <Text style={styles.dataValue}>{machine.suhu}°C</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Wind Speed:</Text>
          <Text style={styles.dataValue}>{machine.kecepatan_angin} km/h</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Air Pressure:</Text>
          <Text style={styles.dataValue}>{machine.tekanan_udara} hPa</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Humidity:</Text>
          <Text style={styles.dataValue}>{machine.kelembaban}%</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.timestampText}>
          Recorded: {new Date(machine.created_at).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity 
        style={[
          styles.paginationButton, 
          pagination.currentPage === 1 && styles.disabledButton
        ]}
        onPress={handlePrevPage}
        disabled={pagination.currentPage === 1}
      >
        <Text style={styles.paginationButtonText}>Previous</Text>
      </TouchableOpacity>
      
      <Text style={styles.paginationText}>
        Page {pagination.currentPage} of {pagination.lastPage}
      </Text>
      
      <TouchableOpacity 
        style={[
          styles.paginationButton, 
          pagination.currentPage === pagination.lastPage && styles.disabledButton
        ]}
        onPress={handleNextPage}
        disabled={pagination.currentPage === pagination.lastPage}
      >
        <Text style={styles.paginationButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {machines.length > 0 ? (
          machines.map(renderMachineCard)
        ) : (
          <Text style={styles.noDataText}>No machine logs available.</Text>
        )}
      </ScrollView>
      
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  cardFooter: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  machineIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    color: '#666',
    fontSize: 14,
  },
  dataValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paginationButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
     paddingHorizontal: 15,
    borderRadius: 5,
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Riwayat;