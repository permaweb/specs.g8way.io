import { Metadata, FormSpec } from "src/types/Spec"
import { ZodError } from "zod"

export interface FormMachineContext {
  type?: string
  tx?: string | null
  spec?: FormSpec
  md?: string
  metadata?: Metadata
  error?: ZodError
  id?: string
}

export interface FormMachineEvent {
  type: string
  md?: string
  data?: FormSpec
  metadata?: Metadata
  error?: ZodError
  [key: string]: unknown
}

export interface FormMachineCurrent { name: string, context: FormMachineContext }
export type FormMachineSend = (event: string | { type: string, [key: string]: unknown }) => void