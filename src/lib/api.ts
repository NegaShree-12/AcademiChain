// frontend/src/lib/api.ts

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

// ================= AUTH API ENDPOINTS =================
export const authAPI = {
  walletLogin: (data: {
    walletAddress: string;
    signature: string;
    message: string;
  }) => api.post("/auth/wallet-login", data),
  emailLogin: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  updateRole: (data: { role: string; institution?: string }) =>
    api.put("/auth/role", data),
  getCurrentUser: () => api.get("/auth/me"),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
};

// ================= STUDENT API ENDPOINTS =================
export const studentAPI = {
  getDashboardStats: () => api.get("/student/dashboard/stats"),
  getCredentials: () => api.get("/student/credentials"),
  getCredentialById: (id: string) => api.get(`/student/credentials/${id}`),
  generateShareLink: (id: string, data: any) =>
    api.post(`/student/credentials/${id}/share`, data),
  getShareLinks: () => api.get("/student/shares"),
  revokeShareLink: (shareId: string) =>
    api.put(`/student/shares/${shareId}/revoke`),
  getVerificationHistory: () => api.get("/student/verifications"),
};

// ================= VERIFICATION API ENDPOINTS =================
export const verificationAPI = {
  verifyByShareId: (shareId: string) => api.get(`/verify/${shareId}`),
  verifyDirect: (credentialId: string) =>
    api.get(`/verify/direct/${credentialId}`),
  getPreview: (credentialId: string) =>
    api.get(`/verify/preview/${credentialId}`),
  getBlockchainStatus: () => api.get("/verify/status"),
  verifyByHash: (hash: string) => api.get(`/verify/hash/${hash}`),
  verifyDocument: (formData: FormData) =>
    api.post("/verify/document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ================= CREDENTIAL API ENDPOINTS (ALIAS FOR STUDENTAPI) =================
export const credentialAPI = studentAPI;

// ================= INSTITUTION API ENDPOINTS =================
export const institutionAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/institution/dashboard/stats"),

  // Students Management
  getStudents: () => api.get("/institution/students"),
  getStudentById: (id: string) => api.get(`/institution/students/${id}`),
  addStudent: (data: any) => api.post("/institution/students", data),
  updateStudent: (id: string, data: any) =>
    api.put(`/institution/students/${id}`, data),
  deleteStudent: (id: string) => api.delete(`/institution/students/${id}`),

  // Credentials Management
  getIssuedCredentials: () => api.get("/institution/credentials"),
  getCredentialById: (id: string) => api.get(`/institution/credentials/${id}`),
  issueCredential: (data: any) => api.post("/institution/credentials", data),
  updateCredential: (
    id: string,
    data: any, // NEW: Update credential
  ) => api.put(`/institution/credentials/${id}`, data),
  revokeCredential: (id: string, reason?: string) =>
    api.put(`/institution/credentials/${id}/revoke`, { reason }),

  // Bulk Operations
  bulkUploadCredentials: (formData: FormData) =>
    api.post("/institution/credentials/bulk", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Statistics and Reports
  getStatistics: () => api.get("/institution/statistics"),
  generateReport: (params: any) => api.get("/institution/reports", { params }),

  // Verification
  verifyCredential: (credentialId: string) =>
    api.get(`/institution/verify/${credentialId}`),
};

// ================= ADMIN API ENDPOINTS =================
export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard/stats"),
  getUsers: (params?: any) => api.get("/admin/users", { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getSystemHealth: () => api.get("/admin/system/health"),
  getBlockchainStatus: () => api.get("/admin/blockchain/status"),
};

// ================= BLOCKCHAIN API ENDPOINTS =================
export const blockchainAPI = {
  issueCredential: (data: any) => api.post("/blockchain/issue", data),
  getCredentials: (address: string) =>
    api.get(`/blockchain/credentials/${address}`),
  verifyCredential: (txHash: string) => api.get(`/blockchain/verify/${txHash}`),
  getNetworkInfo: () => api.get("/blockchain/network"),
  getTransactionReceipt: (txHash: string) =>
    api.get(`/blockchain/tx/${txHash}`),
  getBlockByNumber: (blockNumber: number) =>
    api.get(`/blockchain/block/${blockNumber}`),
  getBalance: (address: string) => api.get(`/blockchain/balance/${address}`),
};

// ================= SHARED API ENDPOINTS =================
export const sharedAPI = {
  getInstitutions: () => api.get("/shared/institutions"),
  getCredentialTypes: () => api.get("/shared/credential-types"),
  searchCredentials: (query: string) => api.get(`/shared/search?q=${query}`),
};

// ================= EXPORT DEFAULT =================
export default api;
