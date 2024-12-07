import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '@/services/baseUrl'; 

// Define the structure of the latest device data
export type DeviceLatest = {
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

// Define the structure of the device
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

// Define the structure of the predicted weather data
export type PredictedWeather = {
    date: string;
    predicted_suhu?: number; 
    predicted_kecepatan_angin?: number; 
    predicted_tekanan_udara?: number; 
    predicted_kelembaban?: number; 
    condition?: string; 
};

// Define the structure of the overall response
export type DevicePredict = {
    latest: DeviceLatest & { device: Device }; 
    data: PredictedWeather[]; 
};

export const fetchDeviceLatest = async (machineId: number): Promise<DevicePredict> => {
    const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage

    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    // Use the client instance to make the request
    try {
        const response: AxiosResponse<DevicePredict> = await client.get<DevicePredict>(`/api/device/exsmoth/${machineId}`, config);
        return response.data; // Return the device response
    } catch (err) {
        // Enhanced error handling
        if (axios.isAxiosError(err)) {
            console.error('Axios error:', err.message);
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