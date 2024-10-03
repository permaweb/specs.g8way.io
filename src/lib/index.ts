import { queryRelated } from './../services/ao';
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
  isNotEmpty,
} from "ramda"
import { Metadata, Spec } from "src/types/Spec"

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
            fromPromise(services.connect)()
              // .chain(isVouched) // isVouched // TODO: add back
              .map(always(txInfo)),
          )
          // dispatch
          .chain(fromPromise(services.upload)) // Goes to arweave
          // .chain(({ id }) => Async.fromPromise(services.register)(id)) // Remove this
          // .chain where we send the tx-id and the metadata to the AO process
      ,
      list: () => {
        // services.queryAll()
        return fromPromise(services.queryAll)()
          .chain((specs) =>
            fromPromise(services.stampCounts)(map(prop("id"), specs)).map(
              (results) => {
                return map(
                  (s) => assoc("stamps", results[s.id]?.vouched || 0, s),
                  specs,
                )
              }
            ),
          )
          .map((specs) => {
            // TODO: ramda-fy
            const newSpecs = specs.map((spec) => {
              const Topics =  spec.Topics.split(',').filter(isNotEmpty)
              const Authors =  spec.Authors.split(',').filter(isNotEmpty)
              return { ...spec, Topics, Authors }
            })
            return newSpecs
          })
          .map(
            sortWith([
              ascend(prop("GroupId") as () => Ord), // TODO: fix this
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
         return fromPromise(services.query)(tx)
          .chain((specs) =>
            fromPromise(services.stampCounts)(map(prop("id"), specs)).map(
              (results) => {
                return map(
                  (s) => assoc("stamps", results[s.id]?.vouched || 0, s),
                   specs,
                )
              }
            ),
          )
          .chain((specs) => {
            return fromPromise(services.get)(map(prop("id"), specs)).map(
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
      related: (tx) => {
        return fromPromise(services.queryRelated)(tx)
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
              ascend(prop("Title") as () => Ord)
            ])
          )
          .map(uniqBy(prop("id"))) as Spec[]
        },
      stamp: (tx) => 
        fromPromise(services.connect)()
          //.chain(isVouched) // isVouched
          .chain(
            (addr) => fromPromise(services.stamp)(tx, addr),
            //.map(x => (console.log(x), x))
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