import Stamps from "@permaweb/stampjs";
import { prop } from "ramda";

const stamps = Stamps.init({});

export const stampCounts = (txs: string[]) => {
  return stamps.counts(txs);
}

export const stamp = (tx: string) => {
  return stamps.hasStamped(tx).then((s) => {
    if (s) {
      return Promise.reject('Already Stamped!')
    }
    const addOne = (n: number) => n + 1
    const count = stampCount(tx).then(addOne)
    return stamps
      .stamp(tx)
      .then(() => count)
  })
}

export const stampCount = (tx: string) => {
  return stamps.count(tx).then(prop("vouched"));
}
