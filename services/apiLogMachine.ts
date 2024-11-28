import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

// Create an Axios client with a base URL
const client = axios.create({
  baseURL: 'http://103.171.85.186/api/device/history', // Replace with your API base URL
});

// Define the structure of each machine log
export type LogMachine = {
  id: number;
  machine_id: number;
  suhu: number;
};

// Define the structure of the paginated response
type PaginatedResponse<T> = {
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
  data: T[];
};

// Function to fetch machine logs
export const fetchMachineLogs = async (): Promise<LogMachine[]> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json', // Correct header type
    },
  };

  try {
    // Make the GET request and specify the expected response type
    const fetchDevice: AxiosResponse<PaginatedResponse<LogMachine>> = await client.get('/api/device', config);
    
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

    return machines; // Return the machine logs
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