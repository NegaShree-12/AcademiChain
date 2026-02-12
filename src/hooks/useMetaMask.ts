import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { authAPI } from "@/lib/api";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMetaMask() {
  const [account, setAccount] = useState<string>("");
  const [chainId, setChainId] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      const hasMetaMask = typeof window.ethereum !== "undefined";
      setIsInstalled(hasMetaMask);

      if (hasMetaMask) {
        // Check if already connected
        checkConnection();

        // Listen for account changes
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      }
    };

    checkMetaMask();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
      }
    } catch (err) {
      console.error("Failed to check connection:", err);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      disconnect();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload(); // Reload on network change
  };

  const connect = async () => {
    if (!isInstalled) {
      window.open("https://metamask.io/download", "_blank");
      throw new Error("MetaMask not installed");
    }

    setIsConnecting(true);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = accounts[0];

        // Sign message for authentication
        const message = `Login to AcademiChain at ${Date.now()}`;
        const signature = await signer.signMessage(message);

        setAccount(address);

        // Login to backend with signature
        await authAPI.walletLogin(address, signature);

        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));

        return { address, signature };
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      if (err.code === 4001) {
        throw new Error("Please connect to MetaMask to continue");
      }
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount("");
    setChainId(0);
  };

  return {
    isInstalled,
    account,
    chainId,
    isConnecting,
    isConnected: !!account,
    connect,
    disconnect,
    getSigner: async () => {
      if (!window.ethereum || !account) return null;
      const provider = new BrowserProvider(window.ethereum);
      return await provider.getSigner();
    },
  };
}
