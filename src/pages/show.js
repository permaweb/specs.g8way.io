import { createMachine, state, transition, invoke, reduce } from "robot3";
import { set, lensProp } from "ramda";

import { useMachine } from "svelte-robot-factory";
import Api from "../lib";
import services from "../services";

const api = Api.init(services);

const machine = createMachine(
  {
    idle: state(
      transition(
        "load",
        "loading",
        reduce((ctx, ev) => ({ ...ctx, tx: ev.tx }))
      )
    ),
    loading: invoke(
      (ctx) => api.get(ctx.tx).toPromise(),
      transition(
        "done",
        "ready",
        reduce((ctx, ev) => ({ ...ctx, spec: ev.data }))
      ),
      transition("error", "error")
    ),
    ready: state(
      transition("stamp", "doStamp"),
      transition("remix", "doRemix"),
      transition(
        "load",
        "loading",
        reduce((ctx, ev) => ({ ...ctx, tx: ev.tx }))
      ),
      transition(
        "reset",
        "ready",
        reduce((ctx) => ({ ...ctx, error: null }))
      )
    ),
    doStamp: invoke(
      (ctx) => api.stamp(ctx.tx).toPromise(),
      transition("done", "ready"),
      transition(
        "error",
        "ready",
        reduce((ctx, ev) => {
          if (typeof ev.error === 'string') {
            return ({ ...ctx, error: { message: ev.error } })
          }
          return ({ ...ctx, error: ev.error })

        })
      )
    )
  },
  () => ({ tx: new URLSearchParams(location.search).get("tx") })
);

const service = () => useMachine(machine, () => null);
export default service;
