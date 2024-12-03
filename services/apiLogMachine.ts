import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '@/services/baseUrl';

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

// Export the structure of the paginated response
export type PaginatedResponse<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

// Function to fetch machine logs
export const fetchMachineLogs = async (page: number = 1): Promise<PaginatedResponse<LogMachine>> => {
  const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
  console.log('Using token:', token); // Log the token to check its value

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Use the token retrieved from AsyncStorage
    },
    params: {
      page: page,
    }
  };

  try {
    // Make the GET request and specify the expected response type
    const fetchDevice: AxiosResponse<PaginatedResponse<LogMachine>> = await client.get('/api/device/history', config);
    
    // Check if the response data is structured correctly
    if (!fetchDevice.data || !fetchDevice.data.data) {
      throw new Error('Invalid response structure');
    }

    // Access the data array from the response
    const machines: LogMachine[] = fetchDevice.data.data;

    // Check if there are any machines returned
    if (machines.length > 0) {
      machines.forEach(machine => {
        console.log(`Data suhu for machine_id "${machine.machine_id}": "${machine.suhu}"`);
      });
    } else {
      console.log('No machines found.');
    }

    return fetchDevice.data; // Return the entire paginated response
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