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
    console.log(6, { tx, s })
    console.log(0, { wallet: window.arweaveWallet })
    return !s
      ? stamps
          .stamp(tx)
          .then((res) => {
            console.log(7, { res })
            return res
          })
          .then(() => new Promise((r) => setTimeout(r, 500)))
          .then(() => stamps.count(tx).then(prop("vouched")))
          .then((res) => {
            console.log(8, { res })
            return res
          })
      : Promise.reject("Already Stamped!")
    }
  )

export const stampCount = (tx) => stamps.count(tx).then(prop("vouched"));