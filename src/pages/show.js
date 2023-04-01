import { createMachine, state, transition, invoke, reduce } from 'robot3';
import { set, lensProp } from 'ramda';
import { useMachine } from 'svelte-robot-factory';
import Api from '../lib'
import services from '../services'

const api = Api.init(services)

const machine = createMachine({
  idle: state(
    transition('load', 'loading', reduce((ctx, ev) => ({ ...ctx, tx: ev.tx })))
  ),
  loading: invoke(
    ctx => {
      console.log(ctx)
      return api.get(ctx.tx).map(md => {
        console.log(md)
        return ({ md })
      }).toPromise()
    },
    transition('done', 'ready', reduce((ctx, ev) => {
      console.log(ev)
      return ({ ...ctx, spec: ev.data.md })
    })),
    transition('error', 'error')
  ),
  ready: state()
}, () => ({ tx: (new URLSearchParams(location.search).get('tx')) }))

const service = useMachine(machine, () => null);
export default service;