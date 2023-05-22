import { getHost } from "./get-host";
import { path } from "ramda";

export const isVouched = (addr) =>
  fetch(`https://${getHost()}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
query ($addresses: [String!]!) {
  transactions(tags:[{name: "Vouch-For", values: $addresses}]) {
    edges {
      node {
        id
      }
    }
  }
}
    `,
      variables: {
        addresses: [addr],
      },
    }),
  })
    .then((res) => res.json())
    .then(path(["data", "transactions", "edges"]))
    .then((edges) => edges.length > 0);
