import { Button } from "@/components/ui/button";
import { Wallet, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
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
  const { login, logout, user } = useAuth();
  const [roleSelectorOpen, setRoleSelectorOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ✅ Move useEffect INSIDE the component
  useEffect(() => {
    const checkUserRole = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role && window.location.pathname === "/") {
          window.location.href = `/${parsed.role}`;
        }
      }
    };

    window.addEventListener("storage", checkUserRole);
    return () => window.removeEventListener("storage", checkUserRole);
  }, []);

  console.log(
    "🔵 WalletButton rendered - isConnected:",
    isConnected,
    "roleSelectorOpen:",
    roleSelectorOpen,
    "account:",
    account,
  );

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    console.log("🟢 handleConnect CLICKED!");
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

        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("📦 localStorage token exists:", !!storedToken);
        console.log("📦 localStorage user exists:", !!storedUser);

        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          console.log("👤 User role:", parsed.role);

          toast({
            title: "✅ Connected Successfully",
            description: `Wallet ${truncateAddress(result.address)} connected`,
          });

          if (!parsed.role) {
            console.log("🎭 OPENING ROLE SELECTOR!");
            setRoleSelectorOpen(true);
          } else {
            console.log("✅ User has role, redirecting to:", parsed.role);
            window.location.href = `/${parsed.role}`;
          }
        } else {
          console.error("❌ No user found in localStorage after login!");
          setRoleSelectorOpen(true);
        }
      }
    } catch (error: any) {
      console.error("❌ Connection error:", error);
      toast({
        title: "❌ Connection Failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      disconnect();
      await logout();
      toast({
        title: "👋 Disconnected",
        description: "Wallet has been disconnected",
      });
    } catch (error) {
      console.error("Disconnection error:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

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

  if (isConnecting || isLoggingIn) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {isConnecting ? "Connecting..." : "Logging in..."}
      </Button>
    );
  }

  if (isConnected && account) {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-mono text-sm font-medium">
              {truncateAddress(account)}
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
        <RoleSelector
          open={roleSelectorOpen}
          onOpenChange={setRoleSelectorOpen}
          walletAddress={account}
        />
      </>
    );
  }

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
