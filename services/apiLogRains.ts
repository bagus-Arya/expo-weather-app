import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '@/utils/baseUrl';

// Define the structure of each machine log
export type LogMachine = {
  id: number;
  machine_id: number;
  lat: string;
  lng: string;
  suhu: number;
  kecepatan_angin: number;
  tekanan_udara: number;
  kelembaban: number;
  kondisi_baik: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

// Define the structure of the rainy conditions response
export type RainyConditionsResponse = {
  rainy_conditions: Record<string, LogMachine>;
};

// Function to fetch machine logs
export const fetchMachineLogs = async (): Promise<LogMachine[]> => {
  const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
  console.log('Using token:', token); // Log the token to check its value

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Use the token retrieved from AsyncStorage
    },
  };

  try {
    // Make the GET request and specify the expected response type
    const fetchDevice: AxiosResponse<RainyConditionsResponse> = await client.get('/api/device/weather/rainy', config);
    
    // Check if the response data is structured correctly
    if (!fetchDevice.data || !fetchDevice.data.rainy_conditions) {
      throw new Error('Invalid response structure');
    }

    // Access the rainy_conditions object and convert it to an array
    const machines: LogMachine[] = Object.values(fetchDevice.data.rainy_conditions);

    // Check if there are any machines returned
    if (machines.length > 0) {
      machines.forEach(machine => {
        console.log(`Data suhu for machine_id "${machine.machine_id}": "${machine.suhu}"`);
      });
    } else {
      console.log('No machines found.');
    }

    return machines; // Return the array of machine logs
  } catch (err) {
    // Enhanced error handling
    if (axios.isAxiosError(err)) {
      console.error('Axios error:', err.response?.data || err.message);
    } else {
      console.error('Unexpected error:', err);
    }
    throw err; // Rethrow the error for further handling
  }  
};