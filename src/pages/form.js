import {
  createMachine,
  state,
  transition,
  invoke,
  reduce,
  immediate,
} from "robot3";
import { useMachine } from "svelte-robot-factory";
import JSToYaml from "convert-yaml";
import { cache } from "../store";
import { assoc } from "ramda";
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
      reduce((ctx, ev) => ({ ...ctx, md: ev.md, metadata: ev.metadata }))
    ),
    transition(
      "reset",
      "ready",
      reduce((ctx) => ({ ...ctx, error: null }))
    )
  ),
  save: invoke(
    (ctx) =>
      api
        .save(
          `---
${JSToYaml.stringify(ctx.metadata).value}

---

${ctx.md}`
        )
        // add saved doc to local cache -- hold for now...
        //.map(({ id }) => (cache.update(assoc(id, ctx.md)), { id }))
        .map(({ id }) => ({ ...ctx, id }))
        .toPromise(),
    transition("done", "confirm"),
    transition(
      "error",
      "ready",
      reduce((ctx, ev) => {
        //console.log(ev)
        return { ...ctx, error: ev.error };
      })
    )
  ),
  confirm: state(
    transition(
      "init",
      "loading",
      reduce((ctx, ev) => ({ ...ctx, ...ev }))
    )
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
    GroupId: "",
    Title: "",
    Description: "",
    Topics: [],
    Authors: [],
  };
}

function updateForks(md) {
  // if remix, we need to update front matter with Forks: {tx}
  return md;
}
