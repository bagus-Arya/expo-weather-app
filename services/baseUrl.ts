import axios from 'axios';

const client = axios.create({
    baseURL: 'http://103.171.85.186'
});

export default client;

// history detail
// http://127.0.0.1:8000/api/device/{machine_id}/history/{user_id}

// user devices
// http://127.0.0.1:8000/api/user-devices/{userId}/{machineId}

// login 
// http://127.0.0.1:8000/api/login