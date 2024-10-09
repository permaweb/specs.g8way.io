import { of, fromPromise, Rejected, Resolved } from "hyper-async"
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
  sortWith,
  ascend,
  descend,
  uniqBy,
  concat,
  Ord,
  isNotEmpty,
} from "ramda"
import { Metadata } from "src/types/Spec"
import {
  getActiveAddressSchema,
  getSchema,
  isVouchedSchema,
  queryAllSchema,
  queryRelatedSchema,
  querySchema,
  Services,
  stampCountsSchema,
  stampSchema,
  uploadSchema
} from '../dal'

export default {
  init: (services: Services) => {
    const connect = fromPromise(getActiveAddressSchema.implement(services.connect))
    const upload = fromPromise(uploadSchema.implement(services.upload))
    const get = fromPromise(getSchema.implement(services.get))
    const queryAll = fromPromise(queryAllSchema.implement(services.queryAll))
    const query = fromPromise(querySchema.implement(services.query))
    const queryRelated = fromPromise(queryRelatedSchema.implement(services.queryRelated))
    const stamp = fromPromise(stampSchema.implement(services.stamp))
    const stampCounts = fromPromise(stampCountsSchema.implement(services.stampCounts))

    // const stamp = fromPromise(services.stamp)

    const isVouched = (addr) =>
      fromPromise(isVouchedSchema.implement(services.isVouched))(addr).chain((res) =>
        res
          ? Resolved(addr)
          : Rejected(new Error("MUST be vouched!")),
      )

    return {
      save: (md: string) =>
        of(md)
          .chain((md: string) =>
            of(md)
              .map(fm)
              .chain((_) => {
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
            connect()
              .map(always(txInfo)),
          )
          // dispatch
          .chain(upload) // Goes to arweave
          // .chain(({ id }) => Async.fromPromise(services.register)(id)) // Remove this
          // .chain where we send the tx-id and the metadata to the AO process
      ,
      list: () => {
        return queryAll()
          .chain((specs) =>
            stampCounts(map(prop("id"), specs)).map(
              (results) => {
                return map(
                  (s) => assoc("stamps", results[s.id]?.vouched || 0, s),
                  specs,
                )
              }
            ),
          )
          .map((specs) => {
            const newSpecs = specs.map((spec) => {
              const Topics =  spec.Topics.split(',').filter(isNotEmpty)
              const Authors =  spec.Authors.split(',').filter(isNotEmpty)
              return { ...spec, Topics, Authors }
            })
            return newSpecs
          })
          .map(
            sortWith([
              ascend(prop("GroupId") as () => Ord),
              descend(prop("Stamps") as () => Ord),
              descend(prop("BlockHeight") as () => Ord),
            ]),
          )
          .map(uniqBy(prop("GroupId")))
          .map(
            sortWith([
              descend(prop("stamps")  as () => Ord), 
              ascend(prop("title") as () => Ord)
            ])
          )
      },
      get: (tx: string, {isMarked}: {isMarked: boolean}) => {
         return query(tx)
          .chain((specs) =>
            stampCounts(map(prop("id"), specs)).map(
              (results) => {
                return map(
                  (s) => assoc("stamps", results[s.id]?.vouched || 0, s),
                   specs,
                )
              }
            )
          )
          .chain((specs) => {
            return get(map(prop("id"), specs)).map(
              (results) => {
                const { body } = fm(results)
                const val = isMarked ? marked(body) : body
                return map(
                  (s) => assoc("html", val, s),
                  specs
                )
              }
            )
          })
        },
      related: (tx: string) => {
        return queryRelated(tx)
          .chain((specs) =>
            stampCounts(map(prop("id"), specs)).map(
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
              ascend(prop("Title") as () => Ord)
            ])
          )
          .map(uniqBy(prop("id")))
        },
      stamp: (tx: string) => 
        connect()
          //.chain(isVouched) // isVouched
          .chain(
            (addr: string) => stamp(tx, addr)
          ),
    }
  },
}


function createTags(md: Metadata) {
  // add atomic asset info here and take
  // authors to create balances object
  const atomicTags = [
    { name: "Data-Protocol", value: "Specification" },
    // { name: "App-Name", value: "SmartWeaveContract" }, // TODO: make sure this is okay
    // { name: "App-Version", value: "0.3.0" },
    // {
    //   name: "Contract-Src",
    //   value: "Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ",
    // },
    // {
    //   name: "Contract-Manifest",
    //   value:
    //     '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}',
    // },
    // {
    //   name: "Init-State",
    //   value: JSON.stringify({
    //     ticker: "SPEC",
    //     name: "SPEC ATOMIC ASSET",
    //     claimable: [],
    //     balances: reduce((a, v) => assoc(v as string, 1, a), {}, md.Authors), // TODO: fix
    //   }),
    // },
    // { name: "License", value: "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8" },
  ]
  return compose(
    concat(atomicTags),
    map(([name, value]: string[]) => ({ name, value })),
    toPairs,
  )(md)
}