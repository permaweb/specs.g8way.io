import { useMachine } from 'preact-robot'
import { createMachine, state, transition, invoke, reduce } from "robot3"

import Api from "../../lib"
import services from "../../services"
import { RelatedMachineContext, RelatedMachineCurrent, RelatedMachineEvent, RelatedMachineSend } from './types'

const api = Api.init(services)

const addTx = (ctx: RelatedMachineContext, ev: RelatedMachineEvent) => {
  return { ...ctx, tx: ev.tx }
}
const addItems = (ctx: RelatedMachineContext, ev: RelatedMachineEvent) => {
  return{ ...ctx, ...ev.data }
}

const machine = createMachine({
  idle: state(transition("load", "loading", reduce(addTx))),
  loading: invoke(
    (ctx: RelatedMachineContext) =>
      api
        .related(ctx.tx)
        .map((specs) => ({ specs }))
        .toPromise(),
    transition("done", "ready", reduce(addItems)),
    transition("error", "error"),
  ),
  ready: state(),
  error: state(),
})

const useRelatedService = (): [RelatedMachineCurrent, RelatedMachineSend] => useMachine(machine, () => null)
export default useRelatedService