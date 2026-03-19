// frontend/src/hooks/useMetaMask.ts
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
      const hasMetaMask =
        typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
      setIsInstalled(hasMetaMask);
    };

    checkMetaMask();

    // Set up listeners
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            console.log("🔍 Found existing connected account:", accounts[0]);
            setAccount(accounts[0].toLowerCase());
            setHasAttemptedConnection(true);
          }
        })
        .catch(console.error);
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
    console.log("🔄 Accounts changed:", accounts);
    if (accounts.length === 0) {
      console.log("🔌 No accounts, disconnecting");
      setAccount("");
      setHasAttemptedConnection(false);
    } else {
      console.log("✅ Account set to:", accounts[0]);
      setAccount(accounts[0].toLowerCase());
      setHasAttemptedConnection(true);
    }
  };

  const handleChainChanged = (chainId: string) => {
    console.log("🔄 Chain changed:", chainId);
    setChainId(parseInt(chainId, 16));
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

        console.log("✅ Signature obtained for:", address);
        setAccount(address);

        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));

        return { address, signature, message };
      }
    } catch (err: any) {
      console.error("❌ Connection error:", err);

      // Handle user rejection specifically
      if (err.code === 4001) {
        throw new Error("User rejected the connection request");
      }

      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    console.log("🔌 Disconnecting wallet");
    setAccount("");
    setChainId(0);
    setHasAttemptedConnection(false);
  };

  return {
    isInstalled,
    account,
    chainId,
    isConnecting,
    isConnected: !!account, // Simple: if we have an account, we're connected
    connect,
    disconnect,
  };
}
