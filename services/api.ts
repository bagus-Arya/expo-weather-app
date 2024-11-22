import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

const client = axios.create({
  baseURL: 'http://103.171.85.186',
});

type logMachine = {
  id: number;
  machine_id: number;
  suhu: number;
}

(async () => {
  const config: AxiosRequestConfig = {
    headers: {
      'json': 'application/json',
    } as RawAxiosRequestHeaders,
  };
  try {
    const fetchDevice: AxiosResponse = await client.get(`/api/device`, config);
    const user: logMachine = fetchDevice.data;
    const suhuShow = user.suhu;

    console.log(`data suhu machine "${suhuShow}"`)
  } catch(err) {
    console.log(err);
  }  
})();