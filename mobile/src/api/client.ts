import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000', // Update this to your computer's IP address (run 'ipconfig' on Windows to find it)

});

export default api;