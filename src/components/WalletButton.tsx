import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface WalletButtonProps {
  variant?: "default" | "hero";
}

export function WalletButton({ variant = "default" }: WalletButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45");
    setIsConnected(true);
    toast({
      title: "Wallet Connected",
      description: "Your MetaMask wallet has been connected successfully.",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        variant={variant === "hero" ? "hero" : "wallet"}
        size={variant === "hero" ? "lg" : "default"}
        className="gap-2"
      >
        <Wallet className="h-5 w-5" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 font-mono">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          {truncateAddress(address!)}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">Connected to</p>
          <p className="font-mono text-sm truncate">{address}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
