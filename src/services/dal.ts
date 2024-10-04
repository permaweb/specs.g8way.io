import { z } from 'zod'

const SpecSchema = z.object({
  description: z.string(),
  forks: z.string(),
  groupId: z.string(),
  height: z.number(),
  id: z.string(),
  owner: z.string(),
  stamps: z.number(),
  timestamp: z.number(),
  title: z.string(),
  type: z.string(),
  variant: z.string().optional()
})

const getActiveAddressSchema = z.function().returns(z.promise(z.string()))

const gqlSchema = z
  .function()
  .args(z.string(), z.object({}).passthrough().optional())
  .returns(z.promise(z.any()))

const postSchema = z
  .function()
  .args(
    z.object({
      data: z.object({}).passthrough(),
      tags: z.array(z.object({ name: z.string(), value: z.string() }))
    })
  )
  .returns(
    z.promise(
      z.object({
        id: z.string()
      })
    )
  )

const getSchema = z.function().args(z.string()).returns(z.promise(SpecSchema))

////// TODO: type these
const stampCountsSchema = z.function().args(z.array(z.string()))
const stampSchema = z.function().args(z.string())
const stampCountSchema = z.function().args(z.string())
//////

const isVouchedSchema = z
  .function()
  .args(z.string())
  .returns(z.promise(z.boolean()))

const registerSchema = z
  .function()
  .args(z.string())
  .returns(
    z.promise(
      z.object({ contractTxId: z.string(), srcTxId: z.string().optional() })
    )
  )

const querySchema = z.function().args(z.string()).returns(z.promise(SpecSchema))

const queryAllSchema = z.function().returns(z.promise(z.array(SpecSchema)))

const queryRelatedSchema = z
  .function()
  .args(z.string())
  .returns(z.promise(z.array(SpecSchema)))

const uploadSchema = z
  .function()
  .args(
    z.object({
      data: z.string(),
      tags: z.array(z.object({ name: z.string(), value: z.string() }))
    })
  )
  .returns(z.promise(z.string()))

type Services = {
  connect: z.infer<typeof getActiveAddressSchema>
  gql: z.infer<typeof gqlSchema>
  dispatch: z.infer<typeof postSchema>
  get: z.infer<typeof getSchema>
  isVouched: z.infer<typeof isVouchedSchema>
  stampCounts: z.infer<typeof stampCountsSchema>
  stamp: z.infer<typeof stampSchema>
  stampCount: z.infer<typeof stampCountSchema>
  register: z.infer<typeof registerSchema>
  query: z.infer<typeof querySchema>
  queryAll: z.infer<typeof queryAllSchema>
  queryRelated: z.infer<typeof queryRelatedSchema>
  upload: z.infer<typeof uploadSchema>
}

export {
  getActiveAddressSchema,
  gqlSchema,
  postSchema,
  getSchema,
  isVouchedSchema,
  stampCountsSchema,
  stampSchema,
  stampCountSchema,
  registerSchema,
  querySchema,
  queryAllSchema,
  queryRelatedSchema,
  uploadSchema,
  Services
}
