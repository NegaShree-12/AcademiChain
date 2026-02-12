import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

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
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  useEffect(() => {
    const checkMetaMask = () => {
      const hasMetaMask = typeof window.ethereum !== "undefined";
      setIsInstalled(hasMetaMask);
    };

    checkMetaMask();

    // Set up listeners but DON'T auto-connect
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

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

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0].toLowerCase());
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connect = async () => {
    if (!isInstalled) {
      window.open("https://metamask.io/download", "_blank");
      throw new Error("MetaMask not installed");
    }

    setIsConnecting(true);
    setHasAttemptedConnection(true);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = accounts[0].toLowerCase();

        const message = `Login to AcademiChain at ${Date.now()}`;
        const signature = await signer.signMessage(message);

        console.log("✅ Signature obtained");
        setAccount(address);

        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));

        return { address, signature, message };
      }
    } catch (err: any) {
      console.error("❌ Connection error:", err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount("");
    setChainId(0);
    setHasAttemptedConnection(false);
  };

  return {
    isInstalled,
    account,
    chainId,
    isConnecting,
    isConnected: !!account && hasAttemptedConnection, // ✅ Only true if user clicked connect
    connect,
    disconnect,
  };
}
