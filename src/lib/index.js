import { Async } from 'crocks'
import fm from 'front-matter'
import { marked } from "marked";

import {
  always, assoc, compose, map, prop, toPairs, over, lensProp, append, path, find, propEq,
  sortWith, uniqWith, ascend, descend
} from 'ramda'

export default {
  init: (services) => ({
    save: (md) => Async.of(md)
      .map(x => (console.log('md ', x), x))
      // extract front matter for tags
      .map(md => ({ data: md, tags: createTags(md) }))
      // set content type for tags
      .map(over(lensProp('tags'), append({ name: 'Content-Type', value: 'text/markdown' })))
      .map(over(lensProp('tags'), append({ name: 'Type', value: 'test-spec' })))
      // connect wallet 
      .chain(txInfo => Async.fromPromise(services.connect)().map(always(txInfo)))
      // dispatch
      .chain(Async.fromPromise(services.dispatch))

    ,
    list: () => {
      return Async.fromPromise(services.gql)(buildSpecListQuery())
        .map(path(['data', 'transactions', 'edges']))
        .map(map(compose(toItem, prop('node'))))
        .chain(specs => Async.fromPromise(services.stampCounts)(map(prop('id'), specs))
          .map(results => map(s => assoc('stamps', results[s.id]?.vouched || 0, s), specs))
        )
        .map(sortWith([ascend(prop('groupId')), descend(prop('stamps')), descend(prop('height'))]))
        .map(uniqWith(prop('groupId')))

    },
    get: (id) => Async.fromPromise(services.get)(id)
      .map(fm)
      .map(({ body, attributes }) => ({
        body,
        ...attributes,
        html: marked(body)
      }))
      .chain(spec => Async.fromPromise(services.stampCount)(id)
        .map(stamps => ({ ...spec, stamps }))
      )
    ,
    related: (id) => Async.fromPromise(services.gql)(buildSingleQuery(), { tx: id })
      .map(path(['data', 'transaction']))
      .map(toItem)
      .chain(spec => Async.fromPromise(services.gql)(buildSpecRelatedQuery(), { groupIds: [spec.groupId] }))
      .map(path(['data', 'transactions', 'edges']))
      .map(map(compose(toItem, prop('node')))),
    stamp: (tx) => Async.fromPromise(services.connect)()
      .chain(_ => Async.fromPromise(services.stamp)(tx)
        .map(x => (console.log(x), x)))


  })
}

function toItem(node) {
  const getTag = n => compose(prop('value'), find(propEq('name', n)))(node.tags)
  return {
    id: node.id,
    owner: node.owner.address,
    height: node.block?.height,
    title: getTag('Title'),
    type: getTag('Type'),
    description: getTag('Description'),
    groupId: getTag('GroupId'),
    forks: getTag('Forks')
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
      }
    }
  }`
}

function buildSpecRelatedQuery() {
  return `query ($groupIds: [String!]!) {
  transactions(first:100, tags: [
    {name: "Type", values: ["test-spec"] },
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
}`
}

function buildSpecListQuery() {
  return `query {
  transactions(first:100, tags: [
    {name: "Content-Type", values: ["text/markdown"]},
    {name: "Type", values: ["test-spec"]}
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
}`
}


function createTags(md) {
  return compose(
    map(([name, value]) => ({ name, value })),
    toPairs,
    prop('attributes'),
    fm
  )(md)
}
