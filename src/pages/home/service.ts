import { createMachine, state, transition, invoke, reduce } from "robot3"
import { assoc } from "ramda"
import { useMachine } from "preact-robot"
import Api from "../../lib"
import services from "../../services"
import { HomeMachineContext, HomeMachineCurrent, HomeMachineEvent, HomeMachineSend } from "./types"

const api = Api.init(services)

const machine = createMachine({
  loading: invoke(
    async (ctx: HomeMachineContext) => {
      return {
        ...ctx,
        specs: await api.list().toPromise()
      }
    },
    transition(
      "done",
      "ready",
      reduce((ctx: HomeMachineContext, ev: HomeMachineEvent) => {
        return { ...ctx, ...ev.data }
      }),
    ),
  ),
  ready: state(
    transition(
      "show",
      "view",
      reduce((ctx: HomeMachineContext, ev: HomeMachineEvent) => {
        return { ...ctx, selected: ev.selected }
      }),
    ),
    transition("learn", "learn"),
  ),
  view: state(
    transition("back", "ready"),
    transition("stamp", "stamping"),
    transition(
      "reset",
      "view",
      reduce((ctx: object) => {
        console.log(3, { ctx })
        return { ...ctx, error: null }
      }),
    ),
  ),
  stamping: invoke(
    async (ctx: HomeMachineContext) => api.stamp(ctx.selected.id).toPromise(),
    transition(
      "done",
      "view",
      // TODO: fix this type when stamping is working
      reduce((ctx: HomeMachineContext, ev: { data: number }) => {
        console.log(4, { ctx, ev })
        const specs = ctx.specs.map((s) =>
          s.id === ctx.selected.id ? assoc("stamps", ev.data, s) : s,
        )
        return {
          ...ctx,
          specs,
          selected: { ...ctx.selected, stamps: ev.data },
        }
      }),
    ),
    transition(
      "error",
      "view",
      reduce((ctx: HomeMachineContext, ev: HomeMachineEvent) => {
        if (typeof ev.error === "string") {
          return { ...ctx, error: { message: ev.error } }
        }
        return { ...ctx, error: ev.error }
      }),
    ),
    transition("learn", "learn"),
  ),
  learn: state(transition("back", "ready")),
  error: state(), // TODO: handle errors

  exit: state(),
})

const useHomeService = () => useMachine(machine, () => null) as [HomeMachineCurrent, HomeMachineSend]
export default useHomeService