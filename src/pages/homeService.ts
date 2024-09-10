import { createMachine, state, transition, invoke, reduce } from "robot3";
import { assoc } from "ramda";
import { useMachine } from "preact-robot"
import Api from "../lib";
import services from "../services";

const api = Api.init(services);

const machine = createMachine({
  loading: invoke(
    async (ctx: object) => ({
      ...ctx,
      specs: await api.list().toPromise(),
    }),
    transition(
      "done",
      "ready",
      reduce((ctx: object, ev: { data: object }) => ({ ...ctx, ...ev.data })),
    ),
  ),
  ready: state(
    transition(
      "show",
      "view",
      reduce((ctx: object, ev: { selected: boolean }) => ({ ...ctx, selected: ev.selected })),
    ),
    transition("learn", "learn"),
  ),
  view: state(
    transition("back", "ready"),
    transition("stamp", "stamping"),
    transition(
      "reset",
      "view",
      reduce((ctx: object) => ({ ...ctx, error: null })),
    ),
  ),
  stamping: invoke(
    async (ctx: { selected: { id: string }}) => api.stamp(ctx.selected.id).toPromise(),
    transition(
      "done",
      "view",
      reduce((ctx: { selected: { id: string }, specs: { id: string }[] }, ev: { data: object }) => {
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
      reduce((ctx: object, ev: { error: unknown }) => {
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

  exit: state(),
});

console.log({ machine })

const useService = () => useMachine(machine, () => null);
export default useService;