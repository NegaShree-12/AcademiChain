import { BrowserProvider, Contract, ethers } from "ethers";

// Get provider
export function getProvider() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }
  return new BrowserProvider(window.ethereum);
}

// Get signer
export async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

// Get current account
export async function getCurrentAccount(): Promise<string> {
  const provider = getProvider();
  const accounts = await provider.send("eth_accounts", []);
  return accounts[0] || "";
}

// Sign a message
export async function signMessage(message: string): Promise<string> {
  const signer = await getSigner();
  return await signer.signMessage(message);
}

// Verify signature
export async function verifySignature(
  message: string,
  signature: string,
  address: string,
): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch {
    return false;
  }
}

// Create a contract instance
export async function getContract(address: string, abi: any) {
  const signer = await getSigner();
  return new Contract(address, abi, signer);
}
