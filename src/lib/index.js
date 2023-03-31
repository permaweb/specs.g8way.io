import { Async } from 'crocks'
import fm from 'front-matter'
import { always, compose, map, prop, toPairs, over, lensProp, append } from 'ramda'

export default {
  init: (services) => ({
    save: (md) => Async.of(md)
      // extract front matter for tags
      .map(md => ({ data: md, tags: createTags(md) }))
      // set content type for tags
      .map(over(lensProp('tags'), append({ name: 'Content-Type', value: 'text/markdown' })))
      // connect wallet 
      .chain(txInfo => Async.fromPromise(services.connect)().map(always(txInfo)))
      // dispatch
      .chain(Async.fromPromise(dispatch))

    ,
    list: () => Promise.resolve([]),
    get: (id) => Promise.resolve(''), // return markdown
    related: (id) => Promise.resolve([])
  })
}


function createTags(md) {
  return compose(
    map(([name, value]) => ({ name, value })),
    toPairs,
    prop('attributes'),
    fm
  )(md)
}
