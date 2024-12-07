import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '@/services/baseUrl';

// Define the structure of each device log
export type DeviceLog = {
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

// Define the structure of each device
export type Device = {
  id: number;
  device_id: number; 
  user_id: number;  
  lat: string;
  lng: string;
  place_name: string;
  suhu: number;
  kecepatan_angin: number;
  tekanan_udara: number;
  kelembaban: number;
  kondisi_baik: number;
  active: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  device_logs: DeviceLog[]; // Array of logs associated with the device
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

// Define the structure of the response for device logs
export type DeviceLogsResponse = PaginatedResponse<Device>;

// Function to fetch machine logs
export const fetchMachineLogs = async (machineId: number, page: number = 1): Promise<DeviceLogsResponse> => {
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
    const fetchDevice: AxiosResponse<DeviceLogsResponse> = await client.get(`/api/device/history/${machineId}`, config);
    
    // Check if the response data is structured correctly
    if (!fetchDevice.data || !fetchDevice.data.data) {
      throw new Error('Invalid response structure');
    }

    // Access the data array from the response
    const devices: Device[] = fetchDevice.data.data;

    // Check if there are any devices returned
    if (devices.length > 0) {
      devices.forEach(device => {
        console.log(`Device ID: ${device.id}, Place: ${device.place_name}`);
        if (device.device_logs && Array.isArray(device.device_logs)) {
          device.device_logs.forEach(log => {
            console.log(`Data suhu for machine_id "${log.machine_id}": "${log.suhu}"`);
          });
        } else {
          console.log(`No logs found for device ID: ${device.id}`);
        }
      });
    } else {
      console.log('No devices found.');
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