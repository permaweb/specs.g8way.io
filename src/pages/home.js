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
      reduce((ctx, ev) => ({ ...ctx, ...ev.data })),
    ),
  ),
  ready: state(
    transition(
      "show",
      "view",
      reduce((ctx, ev) => ({ ...ctx, selected: ev.selected })),
    ),
    transition("learn", "learn"),
  ),
  view: state(
    transition("back", "ready"),
    transition("stamp", "stamping"),
    transition(
      "reset",
      "view",
      reduce((ctx) => ({ ...ctx, error: null })),
    ),
  ),
  stamping: invoke(
    async (ctx) => api.stamp(ctx.selected.id).toPromise(),
    transition(
      "done",
      "view",
      reduce((ctx, ev) => {
        const specs = ctx.specs.map((s) =>
          s.id === ctx.selected.id ? assoc("stamps", ev.data, s) : s,
        );
        return {
          ...ctx,
          specs,
          selected: { ...ctx.selected, stamps: ev.data },
        };
      }),
    ),
    transition(
      "error",
      "view",
      reduce((ctx, ev) => {
        if (typeof ev.error === "string") {
          return { ...ctx, error: { message: ev.error } };
        }
        return { ...ctx, error: ev.error };
      }),
    ),
    transition("learn", "learn"),
  ),
  learn: state(transition("back", "ready")),
  error: state(), // TODO: handle errors
  // @ts-ignore

  exit: state(),
});

const service = () => useMachine(machine, () => null);
export default service;
