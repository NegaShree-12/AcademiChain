import { Eip1193Provider } from "ethers";

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      isMetaMask?: boolean;
      request: (...args: any[]) => Promise<any>;
      on: (...args: any[]) => void;
      removeListener: (...args: any[]) => void;
      removeAllListeners?: (...args: any[]) => void;
      chainId?: string;
    };
  }
}
