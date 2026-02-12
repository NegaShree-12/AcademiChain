import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  role: "student" | "institution" | "verifier" | "admin" | "";
  institution?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    walletAddress: string,
    signature: string,
    message: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: string, institution?: string) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("🔍 AuthProvider checking localStorage...");
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("📦 Token exists:", !!token);
    console.log("📦 Stored user:", storedUser);

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("✅ Setting user from localStorage:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("❌ Failed to parse stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    walletAddress: string,
    signature: string,
    message: string,
  ) => {
    try {
      setIsLoading(true);

      const response = await authAPI.walletLogin({
        walletAddress,
        signature,
        message,
      });

      const { token, user } = response.data;

      // Store token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast({
        title: "✅ Connected Successfully",
        description: `Welcome${user.name ? `, ${user.name}` : ""}!`,
      });

      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "❌ Login Failed",
        description:
          error?.response?.data?.message || error?.message || "Failed to login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (role: string, institution?: string) => {
    try {
      setIsLoading(true);
      console.log("📤 Sending update role request:", { role, institution });

      const response = await authAPI.updateRole({ role, institution });
      console.log("📦 Update role FULL response:", response);

      if (response?.success && response?.token && response?.user) {
        const { token, user } = response;

        // 🔥 IMPORTANT: Clear ALL existing state first
        localStorage.clear(); // This removes ALL old data

        // Set new token and user
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Update React state
        setUser(user);

        console.log("✅ Role updated successfully to:", user.role);

        // Don't redirect here - let the RoleSelector handle the redirect
        return user;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error("❌ Update role error:", error);
      toast({
        title: "❌ Failed to Update Role",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast({
        title: "👋 Disconnected",
        description: "You have been logged out",
      });
    }
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
    updateUserRole,
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
