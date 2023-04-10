import { ArweaveWebWallet } from "arweave-wallet-connector";

const wallet = new ArweaveWebWallet(
  { name: "SPECS" },
  { state: { url: "arweave.app" } }
);

export const getActiveAddress = async () => {
  if (window.arweaveWallet) {
    await window.arweaveWallet.connect(["ACCESS_ADDRESS", "DISPATCH"]);
  } else {
    await wallet.connect();
  }
  return window.arweaveWallet.getActiveAddress();
};
