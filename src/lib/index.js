import { Async } from "crocks";
import fm from "front-matter";
import { marked } from "marked";
import { validateAttrs } from './attrs'
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
} from "ramda";

const { of, fromPromise } = Async

export default {
  init: (services) => {
    const isVouched = addr => Async.fromPromise(services.isVouched)(addr)
      .chain(res => res ? Async.Resolved(addr) : Async.Rejected(new Error('MUST be vouched!')))
    return {
      save: (md) =>
        of(md)
          .map((x) => (console.log("md ", x), x))
          .chain(md => of(md)
            .map(fm)
            .chain(_ => fromPromise(validateAttrs)(prop('attributes', _))
              .map(attributes => ({ data: md, tags: createTags(attributes) }))
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
          .map(
            over(lensProp("tags"), append({ name: "Type", value: "spec" }))
          )
          .map(
            over(lensProp("tags"), append({ name: "Render-With", value: "specs" }))
          )
          // connect wallet
          .chain((txInfo) =>
            Async.fromPromise(services.connect)()
              .chain(isVouched) // isVouched
              .map(always(txInfo))
          )
          .map(x => (console.log('connect', x), x))
          // dispatch
          .chain(Async.fromPromise(services.dispatch)),

      list: () => {
        return Async.fromPromise(services.gql)(buildSpecListQuery())
          .map(path(["data", "transactions", "edges"]))
          .map(map(compose(toItem, prop("node"))))
          .chain((specs) =>
            Async.fromPromise(services.stampCounts)(map(prop("id"), specs)).map(
              (results) =>
                map((s) => assoc("stamps", results[s.id]?.vouched || 0, s), specs)
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
          .map(sortWith([descend(prop('stamps')), ascend(prop('title'))]))
          ;
      },
      get: (id) =>
        Async.fromPromise(services.get)(id)
          .map(fm)
          .map(({ body, attributes, frontmatter }) => ({
            frontmatter,
            body,
            ...attributes,
            html: marked(body),
          }))
          .chain((spec) =>
            Async.fromPromise(services.stampCount)(id).map((stamps) => ({
              ...spec,
              stamps,
            }))
          ),
      related: (id) =>
        Async.fromPromise(services.gql)(buildSingleQuery(), { tx: id })
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
            Async.fromPromise(services.stampCounts)(map(prop("id"), specs)).map(
              (results) =>
                map((s) => assoc("stamps", results[s.id]?.vouched || 0, s), specs)
            )
          )
          .map(sortWith([descend(prop('stamps')), ascend(prop('title'))]))
          .map(uniqBy(prop('id')))
      ,
      stamp: (tx) =>
        Async.fromPromise(services.connect)()
          //.chain(isVouched) // isVouched
          .chain(
            (addr) => Async.fromPromise(services.stamp)(tx, addr)
            //.map(x => (console.log(x), x))
          )

    }
  },
};

function toItem(node) {
  const getTag = (n) =>
    compose(prop("value"), find(propEq("name", n)))(node.tags);
  return {
    id: node.id,
    owner: node.owner.address,
    height: node.block?.height,
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
        }
      }
    }
  }
}`;
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
        }
      }
    }
  }
}`;
}

function createTags(md) {
  return compose(
    map(([name, value]) => ({ name, value })),
    toPairs
    //,
    //prop("attributes"),
    //fm
  )(md);
}
