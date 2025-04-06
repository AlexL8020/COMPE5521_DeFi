// src/api/apiClient.ts
import axios from "axios";

// Use environment variable for base URL if available, otherwise default
const API_BASE_URL = process.env.NEXT_PUBLIC_ANALYTICS_BASE_URL; // Adjust port if needed

console.log("(--------(--------(--------API_BASE_URL", API_BASE_URL);
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for error handling, auth tokens etc.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can add global error handling here if needed
    console.error("API call error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
