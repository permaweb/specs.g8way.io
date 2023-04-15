import Arweave from 'arweave'
import { prop } from 'ramda'
import { getHost } from './get-host'

const info = { host: getHost(), port: 443, protocol: 'https' }
// @ts-ignore
const arweave = Arweave.init(info)

export const gql = async (query, variables = {}) => arweave.api.post('graphql', { query, variables }).then(prop('data'))

export const get = async (tx) => arweave.api.get(tx, { headers: { 'X-Content': 'arweave' } }).then(prop('data'))

export const post = async ({ data, tags }) => {
  try {
    const tx = await arweave.createTransaction({ data })
    tags.map(t => tx.addTag(t.name, t.value))
    const result = await window.arweaveWallet.dispatch(tx)
    console.log(result)
    //await arweave.transactions.sign(tx)
    //await arweave.transactions.post(tx)
    return Promise.resolve({ id: tx.id })
  } catch (e) {
    console.log(e.message)
    return Promise.reject(e)
  }
}
