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
};

// ================= VERIFICATION API ENDPOINTS =================
export const verificationAPI = {
  verifyByShareId: (shareId: string) => api.get(`/verify/${shareId}`),
  verifyDirect: (credentialId: string) =>
    api.get(`/verify/direct/${credentialId}`),
  getPreview: (credentialId: string) =>
    api.get(`/verify/preview/${credentialId}`),
  getBlockchainStatus: () => api.get("/verify/status"),
};

// ================= CREDENTIAL API ENDPOINTS (ALIAS FOR STUDENTAPI) =================
// This fixes your import error
export const credentialAPI = studentAPI;

// ================= INSTITUTION API ENDPOINTS =================
export const institutionAPI = {
  getDashboardStats: () => api.get("/institution/dashboard/stats"),
  getIssuedCredentials: () => api.get("/institution/credentials"),
  issueCredential: (data: any) => api.post("/institution/credentials", data),
  revokeCredential: (id: string) =>
    api.put(`/institution/credentials/${id}/revoke`),
};

// ================= BLOCKCHAIN API ENDPOINTS =================
export const blockchainAPI = {
  issueCredential: (data: any) => api.post("/blockchain/issue", data),
  getCredentials: (address: string) =>
    api.get(`/blockchain/credentials/${address}`),
  verifyCredential: (address: string, txHash: string) =>
    api.get(`/blockchain/verify/${address}/${txHash}`),
  getNetworkInfo: () => api.get("/blockchain/network"),
};

// ================= EXPORT DEFAULT =================
export default api;
