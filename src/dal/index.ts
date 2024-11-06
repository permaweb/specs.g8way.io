import { z } from 'zod'

const AoSpecSchema = z.object({
  Authors: z.string(),
  BlockHeight: z.string(),
  ContentType: z.string(),
  DataProtocol: z.string(),
  Description: z.string(),
  Forks: z.string(),
  GroupId: z.string(),
  Owner: z.string(),
  RenderWith: z.string(),
  Timestamp: z.string(),
  Title: z.string(),
  Topics: z.string(),
  Type: z.string(),
  Variant: z.string(),
  id: z.string(),
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

const getSchema = z.function().args(z.array(z.string())).returns(z.promise(z.any()))

////// TODO: type these
const stampCountsSchema = z.function().args(z.array(z.string()))
const stampSchema = z.function().args(z.string())
const stampCountSchema = z.function().args(z.string())
//////

const isVouchedSchema = z
  .function()
  .args(z.string())
  .returns(z.promise(z.object({ addr: z.string(), vouched: z.boolean() })))

const querySchema = z.function().args(z.string()).returns(z.promise(z.array(AoSpecSchema.optional())))

const queryAllSchema = z.function().returns(z.promise(z.array(AoSpecSchema.optional())))

const queryRelatedSchema = z
  .function()
  .args(z.string())
  .returns(z.promise(z.array(AoSpecSchema.optional())))

const uploadSchema = z
  .function()
  .args(
    z.object({
      data: z.string(),
      tags: z.array(z.object({ name: z.string(), value: z.union([z.string(), z.array(z.string())]) }))
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
  querySchema,
  queryAllSchema,
  queryRelatedSchema,
  uploadSchema,
  Services
}
