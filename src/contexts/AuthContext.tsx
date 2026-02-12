// /contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "@/lib/api"; // ← ADD THIS
import { useToast } from "@/hooks/use-toast"; // ← ADD THIS

interface User {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  role: "student" | "institution" | "verifier" | "admin" | ""; // ← Added admin and empty role
  institution?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (walletAddress: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast(); // ← ADD THIS

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (walletAddress: string) => {
    try {
      setIsLoading(true); // ← ADD THIS

      // Call backend
      const response = await authAPI.walletLogin({
        walletAddress,
        signature: "mock_signature_for_now",
        message: `Login to AcademiChain at ${Date.now()}`,
      });

      const { token, user } = response.data;

      // Store token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast({
        title: "Connected Successfully",
        description: `Welcome${user.name ? `, ${user.name}` : ""}!`,
      });

      return Promise.resolve();
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error?.userMessage || "Failed to login",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false); // ← ADD THIS
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Disconnected",
      description: "Wallet has been disconnected",
    });
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
