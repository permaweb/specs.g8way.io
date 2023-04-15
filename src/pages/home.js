import { createMachine, state, transition, invoke, reduce } from "robot3";
import { assoc, set, lensProp } from "ramda";
import { useMachine } from "svelte-robot-factory";
import Api from "../lib";
import services from "../services";

const api = Api.init(services);

const machine = createMachine({
  loading: invoke(
    async (ctx) => ({
      ...ctx,
      specs: await api.list().toPromise(),
    }),
    // @ts-ignore
    transition(
      "done",
      "ready",
      reduce((ctx, ev) => ({ ...ctx, ...ev.data }))
    )
  ),
  ready: state(
    transition("show", "view", reduce((ctx, ev) => ({ ...ctx, selected: ev.selected })))
  ),
  view: state(
    transition("back", "ready"),
    transition("stamp", "stamping")
  ),
  stamping: invoke(
    async (ctx) => api.stamp(ctx.selected.id).toPromise(),
    transition('done', 'view', reduce((ctx, ev) => {
      const specs = ctx.specs.map(s => s.id === ctx.selected.id ? assoc('stamps', ev.data, s) : s)
      return {
        ...ctx,
        specs,
        selected: { ...ctx.selected, stamps: ev.data }
      }

    })),
    transition('error', 'error')
  ),
  // @ts-ignore

  exit: state(),
});

const service = () => useMachine(machine, () => null);
export default service;
