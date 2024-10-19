import {
  createMachine,
  state,
  transition,
  invoke,
  reduce,
} from "robot3"
import { useMachine } from "preact-robot"
import yaml from 'js-yaml'
import services from "../../services"
import Api from "../../lib"
import { FormMachineContext, FormMachineCurrent, FormMachineEvent, FormMachineSend } from "./types"

const api = Api.init(services)

const machine = createMachine({
  idle: state(
    transition(
      "init",
      "loading",
      reduce((ctx: FormMachineContext, ev: FormMachineEvent) => {
        return { ...ctx, ...ev }
      }),
    ),
  ),
  loading: invoke(
    (ctx: FormMachineContext) => {
      return ctx.tx !== null && ctx.tx !== undefined
        ? api.get(ctx.tx, {isMarked: false}).toPromise()
        : Promise.resolve(template())
    },
    transition(
      "done",
      "ready",
      reduce((ctx: FormMachineContext, ev: FormMachineEvent) => {
        return { ...ctx, spec: ev.data }
      }),
    ),
  ),
  ready: state(
    transition(
      "save",
      "save",
      reduce((ctx: FormMachineContext, ev: FormMachineEvent) => {
        return { ...ctx, md: ev.md, metadata: ev.metadata }
      }),
    ),
    transition(
      "reset",
      "ready",
      reduce((ctx: FormMachineContext) => ({ ...ctx, error: null })),
    ),
  ),
  save: invoke(
    (ctx: FormMachineContext) => {
      return api
.save(
          `---
  ${yaml.dump(ctx.metadata)}---

  ${ctx.md}`,
        )
        // add saved doc to local cache -- hold for now...
        //.map(({ id }) => (cache.update(assoc(id, ctx.md)), { id }))
        .map(({ id }) => ({ ...ctx, id }))
        .toPromise()
      },
    transition("done", "confirm"),
    transition(
      "error",
      "ready",
      reduce((ctx: FormMachineContext, ev: FormMachineEvent) => {
        return { ...ctx, error: ev.error }
      }),
    ),
  ),
  confirm: state(
    transition(
      "init",
      "loading",
      reduce((ctx: FormMachineContext, ev: FormMachineEvent) => {
        return { ...ctx, ...ev }
      }),
    ),
  ),
})

const useFormService = (): [FormMachineCurrent, FormMachineSend] => useMachine(machine, () => null)
export default useFormService

function template() {
  return {
    frontmatter: `GroupId: UNIQUE_IDENTIFIER
  Variant: ""
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
    Variant: "",
    Title: "",
    Description: "",
    Topics: [] as string[],
    Authors: [] as string[],
  }
}

function updateForks(md: string): string {
  // if remix, we need to update front matter with Forks: {tx}
  return md
}
