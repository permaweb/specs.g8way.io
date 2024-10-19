import { GQLSpec } from "src/types/Spec"

export interface ShowMachineContext {
  type?: string
  tx?: string
  spec?: GQLSpec
  error?: { message: string }
}

export interface ShowMachineEvent {
  type: "load" | "done"
  tx?: string
  data?: GQLSpec
  error?: string | { message: string }
  [key: string]: unknown
}


export interface ShowMachineCurrent { name: string, context: ShowMachineContext }
export type ShowMachineSend = (event: string | { type: string, [key: string]: unknown }) => void