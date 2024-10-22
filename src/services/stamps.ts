import Stamps from "@permaweb/stampjs";
import { prop } from "ramda";

const stamps = Stamps.init({});

export const stampCounts = (txs: string[]) => {
  return stamps.counts(txs);
}

export const stamp = (tx: string) => {
  return stamps.hasStamped(tx).then((s) => {
    return !s
      ? stamps
          .stamp(tx)
          .then(() => new Promise((r) => setTimeout(r, 500)))
          .then(() => stamps.count(tx).then(prop("vouched")))
      : Promise.reject("Already Stamped!")
    }
  )
}

export const stampCount = (tx) => {
  return stamps.count(tx).then(prop("vouched"));
}
