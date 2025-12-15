import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.242:3000', // Update this to your computer's IP address (run 'ipconfig' on Windows to find it)
  b
});

export default api;