import { createMachine, state, transition, invoke, reduce, immediate } from "robot3";
import { useMachine } from "svelte-robot-factory";
import { cache } from '../store';
import { assoc } from 'ramda';
import services from "../services";
import Api from "../lib";

const api = Api.init(services);

const machine = createMachine({
  idle: state(
    transition(
      "init",
      "loading",
      reduce((ctx, ev) => ({ ...ctx, ...ev }))
    )
  ),
  loading: invoke(
    (ctx) =>
      ctx.tx !== null
        ? api.get(ctx.tx).map(updateForks).toPromise()
        : Promise.resolve(template()),
    transition(
      "done",
      "ready",
      reduce((ctx, ev) => ({ ...ctx, spec: ev.data }))
    )
  ),
  ready: state(
    transition(
      "save",
      "save",
      reduce((ctx, ev) => ({ ...ctx, md: ev.md }))
    ),
    transition("reset", "idle")
  ),
  save: invoke(
    (ctx) =>
      api
        .save(ctx.md)
        // add saved doc to local cache -- hold for now...
        //.map(({ id }) => (cache.update(assoc(id, ctx.md)), { id }))
        .map(({ id }) => ({ ...ctx, id }))
        .toPromise()
        .catch((e) => {
          console.log(e);
          return Promise.reject(e);
        }),
    transition("done", "confirm"),
    transition("error", "error")
  ),
  confirm: state(
    transition(
      "init",
      "loading",
      reduce((ctx, ev) => ({ ...ctx, ...ev }))
    )
  ),
  error: state(
    immediate('idle')
  ),
});

const service = () => useMachine(machine, () => ({}));
export default service;

function template() {
  return {
    frontmatter: `GroupId: UNIQUE_IDENTIFIER
Title: "Specification Title"
Description: 
Topics:
  - specs
Authors:
  - WALLET_ADDRESS1
  - WALLET_ADDRESS2
`,
    body: `# Your Specification Title

Status: -

Version: -

## Abstract

## Motivation

## Specification

`,
  };
}

function updateForks(md) {
  // if remix, we need to update front matter with Forks: {tx}
  return md;
}
