import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3000/api/",  // baseURL из .env
  headers: {

  }
});

export default api;
