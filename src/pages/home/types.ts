import { AoSpec } from "src/types/Spec"

export interface HomeMachineContext {
  type?: string
  specs?: AoSpec[]
  selected?: AoSpec
  error?: { message: string }
}

export interface HomeMachineEvent {
  type: string
  data?: { specs: AoSpec[] }
  selected?: AoSpec
  error?: string | { message: string }
  [key: string]: unknown
}


export interface HomeMachineCurrent { name: string, context: HomeMachineContext }
export type HomeMachineSend = (event: string | { type: string, [key: string]: unknown }) => void