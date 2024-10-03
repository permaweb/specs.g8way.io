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

const gqlSchema = z.function().returns(z.promise(z.any()))

const postSchema = z.function().returns(
  z.promise(
    z.object({
      id: z.string()
    })
  )
)

const getSchema = z.function().returns(z.promise(z.any()))

////// TODO: type these
const stampCountsSchema = z.function()
const stampSchema = z.function()
const stampCountSchema = z.function()
const registerSchema = z.function()
//////

const isVouchedSchema = z.function().returns(z.promise(z.boolean()))

const querySchema = z.function().returns(z.promise(SpecSchema))

const queryAllSchema = z.function().returns(z.promise(z.array(SpecSchema)))

const queryRelatedSchema = z.function().returns(z.promise(z.array(SpecSchema)))

const uploadSchema = z.function().returns(z.promise(z.string()))

type Services = {
  connect: z.infer<typeof getActiveAddressSchema>,
  gql: z.infer<typeof gqlSchema>,
  dispatch: z.infer<typeof postSchema>,
  get: z.infer<typeof getSchema>,
  isVouched: z.infer<typeof isVouchedSchema>,
  stampCounts: z.infer<typeof stampCountsSchema>,
  stamp: z.infer<typeof stampSchema>,
  stampCount: z.infer<typeof stampCountSchema>,
  register: z.infer<typeof registerSchema>,
  query: z.infer<typeof querySchema>,
  queryAll: z.infer<typeof queryAllSchema>,
  queryRelated: z.infer<typeof queryRelatedSchema>,
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
