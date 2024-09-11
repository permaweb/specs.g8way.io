import { createMachine, state, transition, invoke, reduce } from "robot3";
import { set, lensPath } from "ramda";
import { useMachine } from "preact-robot"

import Api from "../lib";
import services from "../services";

const api = Api.init(services);

const machine = createMachine(
  {
    idle: state(
      transition(
        "load",
        "loading",
        reduce((ctx: object, ev: { tx: unknown }) => ({ ...ctx, tx: ev.tx })),
      ),
    ),
    loading: invoke(
      (ctx: { tx: unknown }) => api.get(ctx.tx).toPromise(),
      transition(
        "done",
        "ready",
        reduce((ctx: object, ev: { data: unknown }) => ({ ...ctx, spec: ev.data })),
      ),
      transition("error", "error"),
    ),
    ready: state(
      transition("stamp", "doStamp"),
      transition("remix", "doRemix"),
      transition(
        "load",
        "loading",
        reduce((ctx: object, ev: { tx: unknown }) => ({ ...ctx, tx: ev.tx })),
      ),
      transition(
        "reset",
        "ready",
        reduce((ctx: object) => ({ ...ctx, error: null })),
      ),
    ),
    doStamp: invoke(
      (ctx: { tx: unknown }) => {
        console.log({ ctx })
        return api.stamp(ctx.tx).toPromise()
      },
      transition(
        "done",
        "ready",
        reduce((ctx: object, ev: { data: unknown }) => {
          console.log(ev);
          return set(lensPath(["spec", "stamps"]), ev.data, ctx);
        }),
      ),
      transition(
        "error",
        "ready",
        reduce((ctx: object, ev: { error: string}) => {
          if (typeof ev.error === "string") {
            return { ...ctx, error: { message: ev.error } }
          }
          return { ...ctx, error: ev.error };
        }),
      ),
    ),
  },
  () => ({ tx: new URLSearchParams(location.search).get("tx") }),
);

const useShowService = () => useMachine(machine, () => null)
export default useShowService