import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '@/services/baseUrl'; // Import the Axios instance

// Define the structure of the device and user
export type Device = {
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
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

// Define the structure of the response
export type DeviceResponse = {
    status: string;
    data: {
        id: number;
        device_id: number;
        user_id: number;
        deleted_at: string | null;
        created_at: string;
        updated_at: string;
        device: Device;
        user: User;
    };
};

export const fetchDeviceList = async (userId: number, machineId: number): Promise<DeviceResponse> => {
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
        const response: AxiosResponse<DeviceResponse> = await client.get<DeviceResponse>(`/api/user-devices/${userId}/${machineId}`, config);
        console.log('Fetched device response:', response.data);
        return response.data; // Return the device response
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