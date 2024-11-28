import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = axios.create({
  baseURL: 'http://103.171.85.186'
});

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    validateStatus: (status) => true
  };

  try {
    console.log('Attempting login with:', credentials.email);
    
    const response: AxiosResponse<LoginResponse> = await client.post('/api/login', credentials, config);
    console.log('Login response status:', response.data.status);

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    if (response.data.token) {
      await Promise.all([
        AsyncStorage.setItem('token', response.data.token),
        AsyncStorage.setItem('userData', JSON.stringify(response.data.user))
      ]);
      client.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || 'Authentication failed';
      console.log('Login error details:', err.response?.data);
      throw new Error(errorMessage);
    }
    throw err;
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const [token, userData] = await Promise.all([
      AsyncStorage.getItem('token'),
      AsyncStorage.getItem('userData')
    ]);
    return !!(token && userData);
  } catch (error) {
    console.log('Login status check failed:', error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem('token'),
    AsyncStorage.removeItem('userData')
  ]);
  delete client.defaults.headers.common['Authorization'];
};