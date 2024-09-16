import { AoSpec } from "src/types/Spec"

export interface RelatedMachineContext {
  type?: string
  tx?: string
  specs?: AoSpec[]
}

export interface RelatedMachineEvent {
  type: "load" | "done"
  tx?: string
  data?: AoSpec[]
  [key: string]: unknown
}


export interface RelatedMachineCurrent { name: string, context: RelatedMachineContext }
export type RelatedMachineSend = (event: string | { type: string, [key: string]: unknown }) => void