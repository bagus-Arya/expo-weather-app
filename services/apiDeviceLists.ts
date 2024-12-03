import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '@/services/baseUrl'; // Import the Axios instance

export type DeviceList = {
    id: number;
    device_id: number;
    user_id: number;
    device: {
        id: number;
        lat: string;
        lng: string;
        place_name: string;
        suhu: number;
        kecepatan_angin: number;
        tekanan_udara: number;
        kelembaban: number;
        kondisi_baik: number;
        active: number;
    };
};

export const fetchDeviceList = async (userId: number): Promise<DeviceList[]> => {
    const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
    console.log('Using token:', token); // Log the token to check its value

    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    // Use the client instance to make the request
    try {
        const response: AxiosResponse<DeviceList[]> = await client.get<DeviceList[]>(`/api/user-devices/${userId}`, config);
        console.log('Fetched devices:', response.data);
        return response.data; // Return the device list
    } catch (err) {
        // Enhanced error handling
        if (axios.isAxiosError(err)) {
            console.error('Axios error:', err.message);
            console.error('Axios error config:', err.config);
            if (err.response) {
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
            } else {
                console.error('Network Error:', err.message);
            }
        } else {
            console.error('Unexpected error:', err);
        }
        throw err; // Rethrow the error for further handling
    }
};