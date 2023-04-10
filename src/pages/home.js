import { createMachine, state, transition, invoke, reduce } from "robot3";
import { set, lensProp } from "ramda";
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
  ready: state(),
  // @ts-ignore

  exit: state(),
});

const service = useMachine(machine, () => null);
export default service;
