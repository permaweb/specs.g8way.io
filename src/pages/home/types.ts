import { Spec } from "src/types/Spec"

export interface HomeMachineContext {
  type?: string
  specs?: Spec[]
  selected?: Spec
  error?: { message: string }
}

export interface HomeMachineEvent {
  type: string
  data?: { specs: Spec[] }
  selected?: Spec
  error?: string | { message: string }
  [key: string]: unknown
}


export interface HomeMachineCurrent { name: string, context: HomeMachineContext }
export type HomeMachineSend = (event: string | { type: string, [key: string]: unknown }) => void