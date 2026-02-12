// frontend/src/components/WalletButton.tsx
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RoleSelector } from "@/components/auth/RoleSelector";

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

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connect();

      if (account) {
        // Login to auth system with wallet address
        await login(account);
        toast({
          title: "Connected Successfully",
          description: `Wallet ${truncateAddress(account)} connected`,
        });

        // After successful login, check if user has a role assigned
        // If not, open role selector modal
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (!parsed.role) {
            setRoleSelectorOpen(true);
          }
        } else {
          setRoleSelectorOpen(true);
        }
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      disconnect();
      logout();
      toast({
        title: "Disconnected",
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

  // If connecting
  if (isConnecting) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // If connected
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
