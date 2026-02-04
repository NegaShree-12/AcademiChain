import { BrowserProvider } from "ethers";

export function getProvider() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }
  return new BrowserProvider(window.ethereum);
}

export async function getAccount(): Promise<string> {
  const provider = getProvider();
  const accounts = await provider.send("eth_accounts", []);
  return accounts[0] || "";
}

export async function getBalance(address: string): Promise<string> {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return balance.toString();
}

export async function getNetworkInfo() {
  const provider = getProvider();
  const network = await provider.getNetwork();
  return {
    name: network.name,
    chainId: Number(network.chainId),
  };
}
