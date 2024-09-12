import { createMachine, state, transition, invoke, reduce } from "robot3"
import { set, lensPath } from "ramda"
import { useMachine } from "preact-robot"

import Api from "../../lib"
import services from "../../services"
import { ShowMachineContext, ShowMachineEvent } from "./types"

const api = Api.init(services)

const machine = createMachine(
  {
    idle: state(
      transition(
        "load",
        "loading",
        reduce((ctx: ShowMachineContext, ev: ShowMachineEvent) => {
          return { ...ctx, tx: ev.tx }
        }),
      ),
    ),
    loading: invoke(
      (ctx: ShowMachineContext) => {
        return api.get(ctx.tx).toPromise()
      },
      transition(
        "done",
        "ready",
        reduce((ctx: ShowMachineContext, ev: ShowMachineEvent) => {
          return { ...ctx, spec: ev.data }
        })
      ),
      transition("error", "error"),
    ),
    ready: state(
      transition("stamp", "doStamp"),
      transition("remix", "doRemix"),
      transition(
        "load",
        "loading",
        reduce((ctx: ShowMachineContext, ev: ShowMachineEvent) => {
          console.log(4, { ctx, ev })
          return { ...ctx, tx: ev.tx }
        }),
      ),
      transition(
        "reset",
        "ready",
        reduce((ctx: ShowMachineContext) => {
          console.log(5, { ctx })
          return { ...ctx, error: null }
        }),
      ),
    ),
    doStamp: invoke(
      (ctx: ShowMachineContext) => {
        return api.stamp(ctx.tx).toPromise()
      },
      transition(
        "done",
        "ready",
        // TODO: fx type after typing api
        reduce((ctx: ShowMachineContext, ev: { data: number }) => {
          return set(lensPath(["spec", "stamps"]), ev.data, ctx)
        }),
      ),
      transition(
        "error",
        "ready",
        reduce((ctx: ShowMachineContext, ev: ShowMachineEvent) => {
          console.log(8, { ctx, ev })
          if (typeof ev.error === "string") {
            return { ...ctx, error: { message: ev.error } }
          }
          return { ...ctx, error: ev.error }
        }),
      ),
    ),
  },
  () => ({ tx: new URLSearchParams(location.search).get("tx") }),
)

const useShowService = () => useMachine(machine, () => null)
export default useShowService