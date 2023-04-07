import { Async } from 'crocks'
import fm from 'front-matter'
import { always, compose, map, prop, toPairs, over, lensProp, append, path, find, propEq } from 'ramda'

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
        .map(x => (console.log(x), x))
    },
    get: (id) => Async.fromPromise(services.get)(id),
    related: (id) => Async.fromPromise(services.gql)(buildSingleQuery(), { tx: id })
      .map(path(['data', 'transaction']))
      .map(toItem)
      .chain(spec => Async.fromPromise(services.gql)(buildSpecRelatedQuery(), { groupIds: [spec.groupId] }))
      .map(path(['data', 'transactions', 'edges']))
      .map(map(compose(toItem, prop('node'))))

  })
}

function toItem(node) {
  const getTag = n => compose(prop('value'), find(propEq('name', n)))(node.tags)
  return {
    id: node.id,
    owner: node.owner.address,
    height: node.block.height,
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
