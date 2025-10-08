// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:1010/api', // Change this if your backend URL is different
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;

