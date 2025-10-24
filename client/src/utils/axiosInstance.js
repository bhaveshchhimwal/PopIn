// src/utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // <-- backend URL
  withCredentials: true, // for cookies
});

export default instance;
