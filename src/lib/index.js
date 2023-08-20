import { Async } from "crocks";
import fm from "front-matter";
import { marked } from "marked";
import { validateAttrs } from "./attrs";
import {
  always,
  assoc,
  compose,
  map,
  prop,
  toPairs,
  over,
  lensProp,
  append,
  path,
  find,
  propEq,
  sortWith,
  ascend,
  descend,
  uniqBy,
  reduce,
  concat
} from "ramda";

const { of, fromPromise, all } = Async;

export default {
  init: (services) => {
    const isVouched = (addr) =>
      Async.fromPromise(services.isVouched)(addr).chain((res) =>
        res
          ? Async.Resolved(addr)
          : Async.Rejected(new Error("MUST be vouched!"))
      );
    return {
      save: (md) =>
        of(md)
          //.map((x) => (console.log("md ", x), x))
          .chain((md) =>
            of(md)
              .map(fm)
              .chain((_) =>
                fromPromise(validateAttrs)(prop("attributes", _)).map(
                  (attributes) => ({ data: md, tags: createTags(attributes) })
                )
              )
          )
          // extract front matter for tags
          //.map((md) => ({ data: md, tags: createTags(md) }))
          // set content type for tags
          .map(
            over(
              lensProp("tags"),
              append({ name: "Content-Type", value: "text/markdown" })
            )
          )
          .map(over(lensProp("tags"), append({ name: "Type", value: "spec" })))
          .map(
            over(
              lensProp("tags"),
              append({ name: "Render-With", value: "specs" })
            )
          )
          // connect wallet
          .chain((txInfo) =>
            Async.fromPromise(services.connect)()
              .chain(isVouched) // isVouched
              .map(always(txInfo))
          )
          .map((x) => (console.log("connect", x), x))
          // dispatch
          .chain(Async.fromPromise(services.dispatch))
      ,

      list: () => {
        return all([
          fromPromise(services.gql)(buildSpecListQuery())
            .map(path(["data", "transactions", "edges"]))
            .map(map(compose(toItem, prop("node")))),
          fromPromise(services.bundlr)(buildBundlrSpecListQuery())
            .map(path(["data", "transactions", "edges"]))
            .map(map(compose(toBundlrItem, prop("node"))))
        ])
          .map(([a, b]) => uniqBy(prop('id'), a.concat(b)))
          .map((x) => (console.log("data", x), x))
          .chain((specs) =>
            fromPromise(services.stampCounts)(map(prop("id"), specs)).map(
              (results) =>
                map(
                  (s) => assoc("stamps", results[s.id]?.vouched || 0, s),
                  specs
                )
            )
          )
          .map(
            sortWith([
              ascend(prop("groupId")),
              descend(prop("stamps")),
              descend(prop("height")),
            ])
          )
          .map(uniqBy(prop("groupId")))
          .map(sortWith([descend(prop("stamps")), ascend(prop("title"))]));
      },
      get: (id) =>
        fromPromise(services.get)(id)
          .map(fm)
          .map(({ body, attributes, frontmatter }) => ({
            frontmatter,
            body,
            ...attributes,
            html: marked(body),
          }))
          .chain((spec) =>
            fromPromise(services.stampCount)(id).map((stamps) => ({
              ...spec,
              stamps,
            }))
          )
          .chain((spec) =>
            fromPromise(services.gql)(buildSingleQuery(), { tx: id })
              .map(path(["data", "transaction"]))
              .map(x => (console.log('data', x), x))
              .map((data) => data ? ({
                ...spec,
                height: data.block ? data.block.height : 'pending',
                timestamp: data.block ? data.block.timestamp : 0,
              }) : ({ ...spec, height: 'pending', timestamp: 0 }))
          ),
      related: (id) =>
        fromPromise(services.gql)(buildSingleQuery(), { tx: id })
          .map(path(["data", "transaction"]))
          .map(toItem)
          .chain((spec) =>
            Async.fromPromise(services.gql)(buildSpecRelatedQuery(), {
              groupIds: [spec.groupId],
            })
          )
          .map(path(["data", "transactions", "edges"]))
          .map(map(compose(toItem, prop("node"))))
          .chain((specs) =>
            fromPromise(services.stampCounts)(map(prop("id"), specs)).map(
              (results) =>
                map(
                  (s) => assoc("stamps", results[s.id]?.vouched || 0, s),
                  specs
                )
            )
          )
          .map(sortWith([descend(prop("stamps")), ascend(prop("title"))]))
          .map(uniqBy(prop("id"))),
      stamp: (tx) =>
        fromPromise(services.connect)()
          //.chain(isVouched) // isVouched
          .chain(
            (addr) => fromPromise(services.stamp)(tx, addr)
            //.map(x => (console.log(x), x))
          ),
    };
  },
};

function toItem(node) {
  const getTag = (n) =>
    compose(prop("value"), find(propEq("name", n)))(node.tags);
  return {
    id: node.id,
    owner: node.owner.address,
    height: node.block ? node.block?.height : 'pending',
    timestamp: node.block ? node.block?.timestamp : 0,
    title: getTag("Title"),
    type: getTag("Type"),
    description: getTag("Description"),
    groupId: getTag("GroupId"),
    forks: getTag("Forks"),
  };
}

function toBundlrItem(node) {
  const getTag = (n) =>
    compose(prop("value"), find(propEq("name", n)))(node.tags);
  return {
    id: node.id,
    owner: node.address,
    height: 'pending',
    timestamp: node.timestamp,
    title: getTag("Title"),
    type: getTag("Type"),
    description: getTag("Description"),
    groupId: getTag("GroupId"),
    forks: getTag("Forks"),
  };
}

function buildSingleQuery() {
  return `query ($tx: ID!) {
    transaction(id: $tx) {
      id
      owner { address } 
      tags { 
        name
        value
      }
      block {
        height
        timestamp
      }
    }
  }`;
}

function buildSpecRelatedQuery() {
  return `query ($groupIds: [String!]!) {
  transactions(first:100, tags: [
    {name: "Type", values: ["spec"] },
    {name: "GroupId", values: $groupIds }
  ]) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name 
          value
        }
        block {
          height
          timestamp
        }
      }
    }
  }
}`;
}

function buildBundlrSpecListQuery() {
  return `
  query {
    transactions(
      limit: 100,
      tags: [
      {name: "Content-Type", values: ["text/markdown"]},
      {name: "Type", values: ["spec"]}
    ]) {
      edges {
        node {
          id
          address
          tags {
            name
            value
          }
          timestamp
        }
      }
    }
  }
  `
}

function buildSpecListQuery() {
  return `query {
  transactions(first:100, tags: [
    {name: "Content-Type", values: ["text/markdown"]},
    {name: "Type", values: ["spec"]}
  ]) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
        block {
          height
          timestamp
        }
      }
    }
  }
}`;
}

function createTags(md) {
  console.log('tags: ', md)
  // add atomic asset info here and take
  // authors to create balances object
  const atomicTags = [
    { name: 'Data-Protocol', value: 'Specification' },
    { name: 'App-Name', value: 'SmartWeaveContract' },
    { name: 'App-Version', value: '0.3.0' },
    { name: 'Contract-Src', value: 'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ' },
    { name: 'Contract-Manifest', value: '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}' },
    {
      name: 'Init-State', value: JSON.stringify({
        ticker: 'SPEC',
        name: 'SPEC ATOMIC ASSET',
        claimable: [],
        balances: reduce((a, v) => assoc(v, 1, a), {}, md.Authors)
      })
    },
    { name: 'License', value: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8' }
  ]
  return compose(
    concat(atomicTags),
    map(([name, value]) => ({ name, value })),
    toPairs
    //,
    //prop("attributes"),
    //fm
  )(md);
}
