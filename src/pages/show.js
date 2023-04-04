import { createMachine, state, transition, invoke, reduce } from 'robot3';
import { set, lensProp } from 'ramda';

import fm from "front-matter";
import { marked } from "marked";

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
      return api.get(ctx.tx)
        .map(fm)
        .map(({ body, attributes }) => ({
          body,
          ...attributes,
          html: marked(body)
        }))
        .toPromise()
    },
    transition('done', 'ready', reduce((ctx, ev) => {
      console.log(ev)
      return ({ ...ctx, spec: ev.data })
    })),
    transition('error', 'error')
  ),
  ready: state(
    transition('stamp', 'doStamp'),
    transition('remix', 'doRemix')
  )
}, () => ({ tx: (new URLSearchParams(location.search).get('tx')) }))

const service = useMachine(machine, () => null);
export default service;