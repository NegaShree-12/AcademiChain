// frontend/src/components/WalletButton.tsx

import { Button } from "@/components/ui/button";
import { Wallet, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { authAPI } from "@/lib/api";

export function WalletButton() {
  const {
    isInstalled,
    account,
    isConnecting,
    isConnected,
    connect,
    disconnect,
  } = useMetaMask();

  const { toast } = useToast();
  const { logout, user } = useAuth();
  const [roleSelectorOpen, setRoleSelectorOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Use a ref to track if auto-login has been attempted
  const autoLoginAttempted = useRef(false);

  // Debug logging
  useEffect(() => {
    console.log("🔵 WalletButton state:", {
      isConnected,
      account,
      isConnecting,
      isLoggingIn,
      userExists: !!user,
      userRole: user?.role,
      roleSelectorOpen,
    });
  }, [isConnected, account, isConnecting, isLoggingIn, user, roleSelectorOpen]);

  // 🔥 CRITICAL FIX: Watch for connection state changes and trigger login
  useEffect(() => {
    console.log("🔄 Connection state changed:", {
      isConnected,
      account,
      hasUser: !!user,
      autoLoginAttempted: autoLoginAttempted.current,
    });

    // If wallet becomes connected, we have an account, no user yet, and we haven't attempted auto-login
    if (
      isConnected &&
      account &&
      !user &&
      !isLoggingIn &&
      !autoLoginAttempted.current
    ) {
      console.log("🎯 AUTO-LOGIN TRIGGERED! Connecting wallet:", account);
      autoLoginAttempted.current = true;

      // Small delay to ensure everything is ready
      setTimeout(() => {
        handleConnect();
      }, 500);
    }
  }, [isConnected, account, user, isLoggingIn]);

  // 🔥 FIX: Auto-open role selector when user has no role
  useEffect(() => {
    if (user && !user.role) {
      console.log("🎭 User has no role, opening role selector");
      setRoleSelectorOpen(true);
    }
  }, [user]);

  // Check for existing user role on mount and storage changes
  useEffect(() => {
    const checkUserRole = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Only redirect if we're on the home page and user has a role
          if (parsed.role && window.location.pathname === "/") {
            window.location.href = `/${parsed.role}`;
          }
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
    };

    // Check on mount
    checkUserRole();

    // Listen for storage changes (login in another tab)
    window.addEventListener("storage", checkUserRole);
    return () => window.removeEventListener("storage", checkUserRole);
  }, []);

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    console.log("🟢 handleConnect EXECUTING!");
    setIsLoggingIn(true);

    try {
      console.log("🟢 Calling connect()...");
      const result = await connect();
      console.log("🟢 connect() RESULT:", result);

      if (result) {
        console.log("🟢 Calling authAPI.walletLogin with:", {
          address: result.address,
          signatureLength: result.signature.length,
          message: result.message,
        });

        const response = await authAPI.walletLogin({
          walletAddress: result.address,
          signature: result.signature,
          message: result.message,
        });

        console.log("🟢 authAPI.walletLogin RESPONSE:", response);

        // Check if response has the expected structure
        if (
          response?.data?.success &&
          response.data.token &&
          response.data.user
        ) {
          // Store token and user in localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          console.log("📦 localStorage token set:", !!response.data.token);
          console.log("📦 localStorage user set:", response.data.user);

          toast({
            title: "✅ Connected Successfully",
            description: `Wallet ${truncateAddress(result.address)} connected`,
          });

          // Check if user needs to select role
          if (!response.data.user.role) {
            console.log("🎭 OPENING ROLE SELECTOR!");
            setRoleSelectorOpen(true);
          } else {
            console.log(
              "✅ User has role, redirecting to:",
              response.data.user.role,
            );
            // Use setTimeout to ensure localStorage is written before redirect
            setTimeout(() => {
              window.location.href = `/${response.data.user.role}`;
            }, 100);
          }
        } else {
          console.error("❌ Invalid response format:", response?.data);
          toast({
            title: "❌ Login Failed",
            description:
              response?.data?.message || "Invalid response from server",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("❌ Connection error:", error);

      // Reset auto-login attempt flag on error so it can try again
      autoLoginAttempted.current = false;

      // Handle user rejection separately
      if (error.code === 4001 || error.message?.includes("rejected")) {
        toast({
          title: "❌ Connection Rejected",
          description: "You rejected the connection request",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Connection Failed",
          description:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      disconnect();
      await logout();

      // Reset auto-login flag
      autoLoginAttempted.current = false;

      // Clear any role selector state
      setRoleSelectorOpen(false);

      toast({
        title: "👋 Disconnected",
        description: "Wallet has been disconnected",
      });

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Disconnection error:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  // If MetaMask is not installed
  if (!isInstalled) {
    return (
      <Button
        onClick={() => window.open("https://metamask.io/download", "_blank")}
        variant="wallet"
        className="gap-2"
      >
        <Wallet className="h-5 w-5" />
        Install MetaMask
      </Button>
    );
  }

  // If connecting or logging in
  if (isConnecting || isLoggingIn) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {isConnecting ? "Connecting..." : "Logging in..."}
      </Button>
    );
  }

  // If user is logged in (has a role), show user info
  if (user?.role) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="font-mono text-sm font-medium">
            {truncateAddress(user.walletAddress || account || "")}
          </span>
          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded capitalize">
            {user.role}
          </span>
        </div>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="h-9"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  // If MetaMask is connected but user has no role yet
  if (isConnected && account) {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-mono text-sm font-medium">
              {truncateAddress(account)}
            </span>
            {!user && (
              <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">
                Ready to login...
              </span>
            )}
            {user && !user.role && (
              <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded">
                Select Role
              </span>
            )}
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            size="sm"
            className="h-9"
          >
            Disconnect
          </Button>
          {/* Manual login button for debugging */}
          {!user && (
            <Button
              onClick={handleConnect}
              variant="default"
              size="sm"
              className="h-9 bg-green-600 hover:bg-green-700"
            >
              Login Now
            </Button>
          )}
        </div>
        <RoleSelector
          open={roleSelectorOpen}
          onOpenChange={setRoleSelectorOpen}
          walletAddress={account}
        />
      </>
    );
  }

  // Default state - not connected
  return (
    <>
      <Button onClick={handleConnect} variant="wallet" className="gap-2">
        <Wallet className="h-5 w-5" />
        Connect Wallet
      </Button>
      <RoleSelector
        open={roleSelectorOpen}
        onOpenChange={setRoleSelectorOpen}
        walletAddress={account || ""}
      />
    </>
  );
}
