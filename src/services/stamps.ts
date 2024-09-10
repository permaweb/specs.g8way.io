import Arweave from "arweave";
import Stamps from "@permaweb/stampjs";
import { WarpFactory } from "warp-contracts";
// import { WarpFactory } from "https://unpkg.com/warp-contracts@1.4.1/bundles/web.bundle.min.js?module";
import { prop } from "ramda";
import { getHost } from "./get-host";

const arweave = Arweave.init({ host: getHost(), port: 443, protocol: "https" });
const stamps = Stamps.init({
  warp: WarpFactory.forMainnet(),
  arweave,
  dre: "https://dre-1.warp.cc/contract",
  wallet: undefined
});

export const stampCounts = (txs) => stamps.counts(txs);

export const stamp = (tx) =>
  stamps.hasStamped(tx).then((s) =>
    !s
      ? stamps
          .stamp(tx)
          .then(() => new Promise((r) => setTimeout(r, 500)))
          .then(() => stamps.count(tx).then(prop("vouched")))
      : Promise.reject("Already Stamped!"),
  );

export const stampCount = (tx) => stamps.count(tx).then(prop("vouched"));