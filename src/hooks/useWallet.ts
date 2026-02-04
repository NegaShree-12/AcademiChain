import { useState, useEffect } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      const hasMetaMask =
        typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
      setIsInstalled(!!hasMetaMask);
    };

    checkMetaMask();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  const connect = async () => {
    if (!isInstalled) {
      alert("Please install MetaMask!");
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error: any) {
      console.error("Connection error:", error);
      alert(`Error: ${error.message || "Failed to connect"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
  };

  return {
    isInstalled,
    account,
    isLoading,
    connect,
    disconnect,
    isConnected: !!account,
  };
}
