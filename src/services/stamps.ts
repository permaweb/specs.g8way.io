import Arweave from "arweave";
import Stamps from "@permaweb/stampjs";
import { WarpFactory } from "warp-contracts";
import { prop } from "ramda";
import { getHost } from "./get-host";

const arweave = Arweave.init({ host: getHost(), port: 443, protocol: "https" });
// TODO: ao-ify
const stamps = Stamps.init({
  warp: WarpFactory.forMainnet(),
  arweave,
  dre: "https://dre-1.warp.cc/contract",
  wallet: "use_wallet"
});

console.log({ wallet: window.arweaveWallet })

export const stampCounts = (txs: string[]) => stamps.counts(txs);

export const stamp = (tx: string) =>
  stamps.hasStamped(tx).then((s) => {
    return !s
      ? stamps
          .stamp(tx)
          .then(() => new Promise((r) => setTimeout(r, 500)))
          .then(() => stamps.count(tx).then(prop("vouched")))
      : Promise.reject("Already Stamped!")
    }
  )

export const stampCount = (tx) => stamps.count(tx).then(prop("vouched"));