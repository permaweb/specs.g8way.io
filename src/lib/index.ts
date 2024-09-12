import { Async } from "crocks"
import fm from "front-matter"
import { marked } from "marked"
import { validateAttrs } from "./attrs"
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
  sortWith,
  ascend,
  descend,
  uniqBy,
  reduce,
  concat,
  Ord,
} from "ramda"
import { Metadata } from "src/types/Spec"

const { of, fromPromise } = Async

export default {
  init: (services) => {
    const isVouched = (addr) =>
      Async.fromPromise(services.isVouched)(addr).chain((res) =>
        res
          ? Async.Resolved(addr)
          : Async.Rejected(new Error("MUST be vouched!")),
      )
    return {
      save: (md: string) =>
        of(md)
          .chain((md: string) =>
            of(md)
              .map(fm)
              .chain((_) => {
                console.log({ _ })
                return fromPromise(validateAttrs)(prop("attributes", _)).map(
                  (attributes) => ({ data: md, tags: createTags(attributes) }),
                )
              },
              ),
          )
          // set content type for tags
          .map(
            over(
              lensProp<{ tags: unknown }>("tags"),
              append({ name: "Content-Type", value: "text/markdown" }),
            ),
          )
          .map(over(lensProp<{ tags: unknown }>("tags"), append({ name: "Type", value: "spec" })))
          .map(
            over(
              lensProp<{ tags: unknown }>("tags"),
              append({ name: "Render-With", value: "specs" }),
            ),
          )
          // connect wallet
          .chain((txInfo) =>
            Async.fromPromise(services.connect)()
              .chain(isVouched) // isVouched
              .map(always(txInfo)),
          )
          // dispatch
          .chain(Async.fromPromise(services.dispatch))
          .chain(({ id }) => Async.fromPromise(services.register)(id))
      ,
      list: () => {
        return fromPromise(services.gql)(buildSpecListQuery())
          .map((ctx) => {
            console.log({ctx})
            return ctx
          })
          .map(path(["data", "transactions", "edges"]))
          .map(map(compose(toItem, prop("node"))))
          .chain((specs) =>
            fromPromise(services.stampCounts)(map(prop("id"), specs)).map(
              (results) =>
                map(
                  (s) => assoc("stamps", results[s.id]?.vouched || 0, s),
                  specs,
                ),
            ),
          )
          .map(
            sortWith([
              ascend(prop("groupId") as () => Ord), // TODO: fix this
              descend(prop("stamps") as () => Ord),
              descend(prop("height") as () => Ord),
            ]),
          )
          .map(uniqBy(prop("groupId")))
          .map(
            sortWith([
              descend(prop("stamps")  as () => Ord), 
              ascend(prop("title") as () => Ord)
            ])
          )
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
            })),
          )
          .chain((spec) =>
            fromPromise(services.gql)(buildSingleQuery(), { tx: id })
              .map(path(["data", "transaction"]))
              // .map((x) => (console.log("data", x), x))
              .map((data) =>
                data
                  ? {
                    ...spec,
                    height: data.block ? data.block.height : "pending",
                    timestamp: data.block ? data.block.timestamp : 0,
                  }
                  : { ...spec, height: "pending", timestamp: 0 },
              ),
          ),
      related: (id) =>
        fromPromise(services.gql)(buildSingleQuery(), { tx: id })
          .map(path(["data", "transaction"]))
          .map(toItem)
          .chain((spec) =>
            Async.fromPromise(services.gql)(buildSpecRelatedQuery(), {
              groupIds: [spec.groupId],
            }),
          )
          .map(path(["data", "transactions", "edges"]))
          .map(map(compose(toItem, prop("node"))))
          .chain((specs) =>
            fromPromise(services.stampCounts)(map(prop("id"), specs)).map(
              (results) =>
                map(
                  (s) => assoc("stamps", results[s.id]?.vouched || 0, s),
                  specs,
                ),
            ),
          )
          .map(
            sortWith([
              descend(prop("stamps") as () => Ord),
              ascend(prop("title") as () => Ord)
            ])
          )
          .map(uniqBy(prop("id"))),
      stamp: (tx) => 
        fromPromise(services.connect)()
          .map((ctx) => {
            console.log(5, { ctx, service: services.stamp.toString() })
            return ctx
          })
          //.chain(isVouched) // isVouched
          .chain(
            (addr) => fromPromise(services.stamp)(tx, addr),
            //.map(x => (console.log(x), x))
          ),
    }
  },
}

function toItem(
  node: { //TODO: move types somewhere
    id: string,
    block: {
      height: number,
      timestamp: number
    },
    owner: {
      address: string 
    }, 
    tags: { 
      name: string, 
      value: string
    }[] 
  }) {
    const getTag = (n: string): string | undefined => 
      node.tags.find(tag => tag.name === n)?.value
    
  return {
    id: node.id,
    owner: node.owner.address,
    height: node.block ? node.block?.height : "pending",
    timestamp: node.block ? node.block?.timestamp : 0,
    title: getTag("Title"),
    type: getTag("Type"),
    description: getTag("Description"),
    groupId: getTag("GroupId"),
    forks: getTag("Forks"),
    variant: getTag("Variant")
  }
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
  }`
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
}`
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
}`
}

function createTags(md: Metadata) {
  // add atomic asset info here and take
  // authors to create balances object
  const atomicTags = [
    { name: "Data-Protocol", value: "Specification" },
    { name: "App-Name", value: "SmartWeaveContract" },
    { name: "App-Version", value: "0.3.0" },
    {
      name: "Contract-Src",
      value: "Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ",
    },
    {
      name: "Contract-Manifest",
      value:
        '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}',
    },
    {
      name: "Init-State",
      value: JSON.stringify({
        ticker: "SPEC",
        name: "SPEC ATOMIC ASSET",
        claimable: [],
        balances: reduce((a, v) => assoc(v as string, 1, a), {}, md.Authors), // TODO: fix
      }),
    },
    { name: "License", value: "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8" },
  ]
  return compose(
    concat(atomicTags),
    map(([name, value]: string[]) => ({ name, value })),
    toPairs,
  )(md)
}