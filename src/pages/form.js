import { createMachine, state, transition, invoke, reduce } from 'robot3';
import { useMachine } from 'svelte-robot-factory';

import services from '../services'
import Api from '../lib'

const api = Api(services)

const machine = createMachine({
  ready: state(
    transition('save', 'save', reduce((ctx, ev) => ({ ...ctx, md: ev.md })))
  ),
  save: invoke(
    (ctx) => api.create(ctx.md).toPromise(),
    transition('done', 'confirm'),
    transition('error', 'error')
  )
})

const service = useMachine(machine, () => ({}))
export default service
