// /lib/api.ts
import axios from "axios";
import { toast } from "@/hooks/use-toast";

// Configuration - Use environment variable or default
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Set this to true to use real backend, false for mock
const USE_REAL_API = true;

console.log(`🌐 API Configuration:`);
console.log(`   Mode: ${USE_REAL_API ? "REAL" : "MOCK"}`);
console.log(`   Base URL: ${API_BASE}`);
console.log(
  `   Backend: ${USE_REAL_API ? "Connecting to real backend" : "Using mock data"}`,
);

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add auth token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add request ID for debugging
  config.headers["X-Request-ID"] =
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful API calls in development
    if (import.meta.env.DEV) {
      console.log(
        `✅ API ${response.config.method?.toUpperCase()} ${response.config.url}:`,
        response.status,
      );
    }
    return response;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Network error";
    const status = error.response?.status;

    console.error("❌ API Error:", {
      status,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle specific error cases
    if (status === 401) {
      // Unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/verify")) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } else if (status === 404) {
      toast({
        title: "Not Found",
        description: "The requested resource was not found",
        variant: "destructive",
      });
    } else if (status >= 500) {
      toast({
        title: "Server Error",
        description: "Backend server is having issues. Please try again later.",
        variant: "destructive",
      });
    } else if (!navigator.onLine) {
      toast({
        title: "You're Offline",
        description: "Please check your internet connection",
        variant: "destructive",
      });
    } else if (error.code === "ECONNABORTED") {
      toast({
        title: "Connection Timeout",
        description: "Server is taking too long to respond",
        variant: "destructive",
      });
    }

    return Promise.reject({
      ...error,
      userMessage: errorMessage,
    });
  },
);

// ================= FALLBACK MOCK FUNCTIONS (if backend fails) =================
const mockDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const mockAPI = {
  // Credentials
  getAllCredentials: async () => {
    await mockDelay(500);
    const mockData = [
      {
        id: "1",
        title: "Bachelor of Computer Science",
        type: "degree",
        institution: "Massachusetts Institute of Technology",
        issueDate: "2023-06-15T00:00:00.000Z",
        txHash:
          "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
        blockNumber: 18234567,
        status: "verified",
        description: "Awarded with Honors, GPA: 3.85/4.0",
      },
      {
        id: "2",
        title: "Master of Data Science",
        type: "degree",
        institution: "Stanford University",
        issueDate: "2024-05-20T00:00:00.000Z",
        txHash:
          "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        blockNumber: 19456789,
        status: "verified",
        description: "Specialization in Machine Learning",
      },
    ];
    return { data: mockData };
  },

  walletLogin: async (walletAddress: string) => {
    await mockDelay(800);
    const token = "mock_jwt_token_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("token", token);
    return {
      data: {
        token,
        user: {
          id: "1",
          email: `user-${walletAddress?.slice(2, 8) || "test"}@example.com`,
          name: `User ${walletAddress?.slice(2, 8) || "Test"}`,
          walletAddress:
            walletAddress || "0x0000000000000000000000000000000000000000",
          role: "student",
          institution: "Example University",
          isVerified: true,
        },
      },
    };
  },

  getStudents: async () => {
    await mockDelay(400);
    return {
      data: [
        {
          id: "1",
          name: "John Doe",
          email: "john@mit.edu",
          walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
          status: "active",
          program: "Computer Science",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@mit.edu",
          walletAddress:
            "0x8f7d3a2c1e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1",
          status: "active",
          program: "Data Science",
        },
      ],
    };
  },
};

// ================= SMART API FUNCTIONS (auto-fallback) =================
async function callWithFallback<T>(
  realCall: () => Promise<T>,
  mockCall: () => Promise<T>,
): Promise<T> {
  if (!USE_REAL_API) {
    console.log("📱 Using mock API (manual override)");
    return mockCall();
  }

  try {
    console.log("🌐 Attempting real API call...");
    return await realCall();
  } catch (error: any) {
    console.warn(
      "⚠️ Real API call failed, falling back to mock:",
      error.message,
    );

    // Show toast notification
    if (error.code !== "ERR_CANCELED") {
      // Don't show for cancelled requests
      toast({
        title: "Backend Unavailable",
        description: "Using demo data. Some features may be limited.",
        variant: "default",
      });
    }

    return mockCall();
  }
}

// ================= EXPORTED API FUNCTIONS =================
export const credentialAPI = {
  getAll: () =>
    callWithFallback(
      () => api.get("/credentials"),
      () => mockAPI.getAllCredentials(),
    ),

  getById: (id: string) =>
    callWithFallback(
      () => api.get(`/credentials/${id}`),
      async () => {
        await mockDelay(300);
        return {
          data: {
            id,
            title: "Sample Credential",
            type: "degree",
            institution: "University",
            txHash: "0x" + Math.random().toString(16).slice(2, 66),
            blockNumber: 18234567,
            status: "verified",
            description: "Sample credential data",
          },
        };
      },
    ),

  create: (data: any) =>
    callWithFallback(
      () => api.post("/credentials", data),
      async () => {
        await mockDelay(1000);
        return {
          data: {
            success: true,
            message: "Credential created (mock mode)",
            txHash: "0x" + Math.random().toString(16).slice(2, 66),
            blockNumber: Math.floor(Math.random() * 20000000),
            credentialId: Date.now().toString(),
          },
        };
      },
    ),

  share: (id: string, options: any) =>
    callWithFallback(
      () => api.post(`/credentials/${id}/share`, options),
      async () => {
        await mockDelay(600);
        return {
          data: {
            success: true,
            shareId: `share_${id}_${Date.now()}`,
            link: `${window.location.origin}/verify/${id}`,
            expiresAt: options.expiresAt || null,
            settings: {
              requiresPassword: false,
              allowDownload: true,
              maxViews: null,
            },
          },
        };
      },
    ),

  verify: (hash: string) =>
    callWithFallback(
      () => api.get(`/verify/${hash}`),
      async () => {
        await mockDelay(700);
        return {
          data: {
            isValid: true,
            credential: {
              id: "1",
              title: "Verified Credential",
              type: "degree",
              institution: "Verified University",
              txHash: hash,
              blockNumber: 18234567,
              status: "verified",
              description: "Blockchain-verified credential",
            },
            verification: {
              txHash: hash,
              blockNumber: 18234567,
              confirmations: Math.floor(Math.random() * 100000) + 1000,
              verifiedAt: new Date().toISOString(),
              issuer: {
                address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
                verified: true,
              },
            },
          },
        };
      },
    ),
};

export const authAPI = {
  // Wallet login (Web3)
  walletLogin: async (walletAddress: string, signature: string) => {
    const response = await api.post("/auth/wallet-login", {
      walletAddress,
      signature,
      message: `Login to AcademiChain at ${Date.now()}`,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  },

  // Email/password login
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  },

  // Register
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Get logged-in user profile
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Logout
  logout: async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true };
  },
};

export const institutionAPI = {
  getStudents: () =>
    callWithFallback(
      () => api.get("/institution/students"),
      () => mockAPI.getStudents(),
    ),

  issueCredential: (data: any) =>
    callWithFallback(
      () => api.post("/institution/issue", data),
      async () => {
        await mockDelay(1200);
        return {
          data: {
            success: true,
            message: `Credential "${data.title}" issued successfully (mock)`,
            txHash: "0x" + Math.random().toString(16).slice(2, 66),
            blockNumber: Math.floor(Math.random() * 20000000),
            credentialId: Date.now().toString(),
          },
        };
      },
    ),

  getStats: () =>
    callWithFallback(
      () => api.get("/institution/stats"),
      async () => {
        await mockDelay(400);
        return {
          data: {
            totalIssued: 15432,
            activeStudents: 2845,
            todayIssues: 23,
            verificationRate: 99.8,
          },
        };
      },
    ),

  bulkUpload: (data: any) =>
    callWithFallback(
      () => api.post("/institution/bulk-upload", data),
      async () => {
        await mockDelay(1500);
        return {
          data: {
            success: true,
            processed: 25,
            failed: 0,
            message: "Bulk upload processed (mock)",
          },
        };
      },
    ),
};

export const blockchainAPI = {
  verifyTransaction: (txHash: string) =>
    callWithFallback(
      () => api.get(`/blockchain/verify/${txHash}`),
      async () => {
        await mockDelay(600);
        return {
          data: {
            isValid: true,
            blockNumber: 18234567,
            confirmations: Math.floor(Math.random() * 100000) + 1000,
            timestamp: new Date().toISOString(),
          },
        };
      },
    ),

  getNetworkInfo: () =>
    callWithFallback(
      () => api.get("/blockchain/network"),
      async () => {
        await mockDelay(300);
        return {
          data: {
            name: "sepolia",
            chainId: 11155111,
            blockHeight: 19543210,
            status: "connected",
          },
        };
      },
    ),
};

// ================= UTILITY FUNCTIONS =================
export const checkBackendHealth = async (): Promise<boolean> => {
  if (!USE_REAL_API) {
    console.log("📱 Mock mode enabled - skipping backend check");
    return true;
  }

  try {
    const response = await api.get("/health", { timeout: 3000 });
    const isHealthy = response.data.status === "OK";

    if (isHealthy) {
      console.log("✅ Backend is healthy:", response.data);
    } else {
      console.warn("⚠️ Backend responded but status not OK:", response.data);
    }

    return isHealthy;
  } catch (error) {
    console.error("❌ Backend health check failed:", error);
    return false;
  }
};

export const isBackendAvailable = async (): Promise<boolean> => {
  const isHealthy = await checkBackendHealth();

  if (!isHealthy) {
    toast({
      title: "Backend Unavailable",
      description: "Using fallback data. Some features may be limited.",
      variant: "default",
      duration: 3000,
    });
  }

  return isHealthy;
};

// Initialize connection check on app startup
let healthCheckDone = false;

export const initializeAPI = async () => {
  if (healthCheckDone) return;

  console.log("🔍 Initializing API connection...");

  if (USE_REAL_API) {
    const isHealthy = await checkBackendHealth();

    if (!isHealthy) {
      console.warn(
        "⚠️ Backend not available, some features will use mock data",
      );
      toast({
        title: "Backend Connection",
        description: "Could not connect to backend server. Using demo mode.",
        variant: "default",
      });
    }
  }

  healthCheckDone = true;
};

// Auto-initialize in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    initializeAPI();
  }, 1000);
}
