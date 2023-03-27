import { createMachine, state, transition, invoke, reduce } from 'robot3';
import { set, lensProp } from 'ramda';
import { useMachine } from 'svelte-robot-factory';
import API from '../lib'
import services from '../services'

const api = API.init(services)

const machine = createMachine({
  loading: invoke(
    async () => ({
      subs: await api.getSubdomains().toPromise(),
      fees: await api.getFees().toPromise(),
      //arFee: await api.getArFee().toPromise()
      arFee: await fetch(`https://arweave.net/price/256`).then(r => r.text())
        .then(fee => (Number(fee) / 1e12).toFixed(6))
    }),
    // @ts-ignore
    transition('done', 'ready', reduce((ctx, ev) => ({ ...ctx, ...ev.data })))
  ),
  ready: state(
    // @ts-ignore
    transition('search', 'searching', reduce((ctx, ev) => ({ ...ctx, q: ev.q })))
  ),
  searching: invoke((ctx) => {
    return ctx.subs.includes(ctx.q) ? Promise.resolve(true) : Promise.reject(false)
  },
    transition('done', 'found'),
    transition('error', 'not_found')
  ),
  found: state(
    // @ts-ignore
    transition('new_search', 'ready', reduce(set(lensProp('q'), '')))
  ),
  not_found: state(
    // @ts-ignore
    transition('new_search', 'ready', reduce(set(lensProp('q'), ''))),
    transition('register', 'register')
  ),
  register: state(
    transition('register', 'submitting'),
    transition('cancel', 'ready')
  ),
  submitting: invoke(
    (ctx) => api.register(ctx.q, 'WoywoK1huQU3yYrGBahFpkgzAy1gDY-n0uR-_nHHVQE').toPromise(),
    transition('done', 'exit'),
    transition('error', 'error')
  ),
  exit: state()
});

const service = useMachine(machine, () => null);
export default service;