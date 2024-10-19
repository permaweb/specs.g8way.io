// import Stamps from "@permaweb/stampjs";
// import { prop } from "ramda";

// const stamps = Stamps.init({});

export const stampCounts = (txs: string[]) => {
  return Promise.resolve(txs.map(tx => ({ tx: { total: 0, vouched: 0 }})))
  // return stamps.counts(txs);
}

export const stamp = (tx: string) => {
  return Promise.reject("Stamping disabled")
  // return stamps.hasStamped(tx).then((s) => {
  //   console.log({ s })
  //   return !s
  //     ? stamps
  //         .stamp(tx)
  //         .then(() => new Promise((r) => setTimeout(r, 500)))
  //         .then(() => stamps.count(tx).then(prop("vouched")))
  //     : Promise.reject("Already Stamped!")
  //   }
  // )
}

export const stampCount = (tx) => {
  return Promise.resolve({ total: 0, vouched: 0 })
// stamps.count(tx).then(prop("vouched"));
}