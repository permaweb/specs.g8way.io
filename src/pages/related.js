import { createMachine, state, transition, invoke, reduce } from "robot3";

import { useMachine } from "svelte-robot-factory";
import Api from "../lib";
import services from "../services";

const api = Api.init(services);

const addTx = (ctx, ev) => ({ ...ctx, tx: ev.tx });
const addItems = (ctx, ev) => ({ ...ctx, ...ev.data });

const machine = createMachine({
  idle: state(transition("load", "loading", reduce(addTx))),
  loading: invoke(
    (ctx) =>
      api
        .related(ctx.tx)
        .map((specs) => ({ specs }))
        .toPromise(),
    transition("done", "ready", reduce(addItems)),
    transition("error", "error")
  ),
  ready: state(),
  error: state(),
});

const service = useMachine(machine, () => null);
export default service;
