import { z } from "zod"

export type Services = {
  connect: z.infer<typeof getActiveAddressSchema>
}
export const getActiveAddressSchema = z.function()
  .returns(
    z.promise(z.string())
  )
