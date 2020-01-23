import axios from 'axios';

const api = axios.create({
  baseURL: "https://omnistackweek6-backend.herokuapp.com",
});

export default api;
