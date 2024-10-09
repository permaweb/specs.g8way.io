import Arweave from "arweave";
import { prop } from "ramda";
import { getHost } from "./get-host";

const info = { host: getHost(), port: 443, protocol: "https" };
const arweave = Arweave.init(info);

export const gql = async (query: string, variables = {}) =>
  fetch("https://arweave-search.goldsky.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  }).then((res) => res.json());

export const get = async (tx) =>
  arweave.api
    .get(tx, { headers: { "X-Content": "arweave" } })
    .then(prop("data"))
    .catch(() =>
      fetch(`https://arweave.net/${tx}`).then((res) => res.text()),
    );

export const post = async ({ data, tags }) => {
  try {
    const tx = await arweave.createTransaction({ data });
    tags.map((t) => tx.addTag(t.name, t.value));
    const result = await window.arweaveWallet.dispatch(tx);
    return Promise.resolve({ id: result.id });
  } catch (e) {
    return Promise.reject(e);
  }
};