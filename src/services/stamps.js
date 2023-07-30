import Stamps from "@permaweb/stampjs";
//import { WarpFactory } from "warp-contracts/web";
import { WarpFactory } from "https://unpkg.com/warp-contracts@1.4.1/bundles/web.bundle.min.js";
import { prop } from "ramda";
import { getHost } from "./get-host";

const arweave = Arweave.init({ host: getHost(), port: 443, protocol: "https" });
const stamps = Stamps.init({ warp: WarpFactory.forMainnet(), arweave, dre: 'https://dre-5.warp.cc/contract' });

export const stampCounts = (txs) => stamps.counts(txs);

export const stamp = (tx, addr) =>
  stamps
    .hasStamped(tx)
    .then((s) =>
      !s
        ? stamps.stamp(tx)
          .then(_ => new Promise(r => setTimeout(r, 500)))
          .then((_) => stamps.count(tx).then(prop("vouched")))
        : Promise.reject("Already Stamped!")
    );

export const stampCount = (tx) => stamps.count(tx).then(prop("vouched"));
