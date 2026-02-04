// /lib/api.ts
import axios from "axios";

// For Vite/CRA, use import.meta.env instead of process.env
const API_BASE =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:3001";

console.log("API Base URL:", API_BASE); // For debugging

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

// Mock API functions for development (remove when real API is ready)
const isDev = import.meta.env.DEV;

// Credential endpoints
export const credentialAPI = {
  getAll: async () => {
    if (isDev) {
      // Return mock data for development
      const mockCredentials = [
        {
          id: "1",
          title: "Bachelor of Computer Science",
          type: "degree",
          institution: "Massachusetts Institute of Technology",
          issueDate: "2023-06-15",
          txHash:
            "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
          blockNumber: 18234567,
          status: "verified",
          description: "Awarded with Honors, GPA: 3.85/4.0",
        },
        // Add more mock credentials as needed
      ];
      return { data: mockCredentials };
    }
    return api.get("/credentials");
  },

  getById: (id: string) => api.get(`/credentials/${id}`),

  create: (data: any) => api.post("/credentials", data),

  share: async (id: string, options: any) => {
    if (isDev) {
      // Mock share function
      console.log("Mock share called:", { id, options });
      return {
        data: {
          success: true,
          shareId: `share_${id}_${Date.now()}`,
          link: `${window.location.origin}/verify/${id}`,
          expiresAt: options.expiresAt || null,
        },
      };
    }
    return api.post(`/credentials/${id}/share`, options);
  },

  verify: (hash: string) => api.get(`/verify/${hash}`),
};

// User endpoints
export const userAPI = {
  getProfile: async () => {
    if (isDev) {
      // Mock user profile
      const mockUser = {
        id: "1",
        email: "student@university.edu",
        name: "John Student",
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
        role: "student",
        institution: "MIT",
      };
      return { data: mockUser };
    }
    return api.get("/users/me");
  },

  updateProfile: (data: any) => api.put("/users/me", data),

  register: (data: any) => api.post("/users/register", data),
};

// Institution endpoints
export const institutionAPI = {
  getStudents: async () => {
    if (isDev) {
      // Mock students data
      const mockStudents = [
        {
          id: 1,
          name: "John Doe",
          email: "john@mit.edu",
          wallet: "0x742d...b045",
          status: "active",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@mit.edu",
          wallet: "0x8f7d...e0f1",
          status: "active",
        },
      ];
      return { data: mockStudents };
    }
    return api.get("/institution/students");
  },

  issueCredential: (data: any) => api.post("/institution/issue", data),

  bulkUpload: (data: any) => api.post("/institution/bulk-upload", data),
};
