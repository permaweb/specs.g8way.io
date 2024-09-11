import {
  createMachine,
  state,
  transition,
  invoke,
  reduce,
  immediate,
} from "robot3";
import { useMachine } from "preact-robot";
// import JSToYaml from "convert-yaml";
import yaml from 'js-yaml'
// import { cache } from "../store";
import { assoc } from "ramda";
import services from "../services";
import Api from "../lib";

const api = Api.init(services);

// Define the context type for the machine
interface MachineContext {
  tx: string | null;
  spec?: any;
  md?: string;
  metadata?: Record<string, any>;
  error?: string;
  id?: string;
}

// Update the MachineEvent interface
interface MachineEvent {
  type: string;
  [key: string]: any;
}

const machine = createMachine({
  idle: state(
    transition(
      "init",
      "loading",
      reduce((ctx: object, ev: object) => ({ ...ctx, ...ev })),
    ),
  ),
  loading: invoke(
    (ctx: any) =>
      ctx.tx !== null
        ? api.get(ctx.tx).map(updateForks).toPromise()
        : Promise.resolve(template()),
    transition(
      "done",
      "ready",
      reduce((ctx: object, ev: any) => ({ ...ctx, spec: ev.data })),
    ),
  ),
  ready: state(
    transition(
      "save",
      "save",
      reduce((ctx: object, ev: any) => ({ ...ctx, md: ev.md, metadata: ev.metadata })),
    ),
    transition(
      "reset",
      "ready",
      reduce((ctx: object) => ({ ...ctx, error: null })),
    ),
  ),
  save: invoke(
    (ctx: any) =>
      api
        .save(
          `---
  ${yaml.dump(ctx.metadata)}

  ---

  ${ctx.md}`,
        )
        // add saved doc to local cache -- hold for now...
        //.map(({ id }) => (cache.update(assoc(id, ctx.md)), { id }))
        .map(({ id }) => ({ ...ctx, id }))
        .toPromise(),
    transition("done", "confirm"),
    transition(
      "error",
      "ready",
      reduce((ctx: object, ev: any) => {
        return { ...ctx, error: ev.error };
      }),
    ),
  ),
  confirm: state(
    transition(
      "init",
      "loading",
      reduce((ctx: object, ev: any) => ({ ...ctx, ...ev })),
    ),
  ),
});

const useFormService = () => useMachine(machine, () => null);
export default useFormService;

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
  };
}

function updateForks(md: string): string {
  // if remix, we need to update front matter with Forks: {tx}
  return md;
}
