import { contractsByWallet, readState, deploy } from './warp'
import { getActiveAddress } from './wallet'
import { post, gql, get } from './arweave'
import { stampCounts } from './stamps'

export default {
  connect: getActiveAddress,
  gql,
  dispatch: post,
  get,
  contractsByWallet,
  readState,
  getActiveAddress,
  deploy,
  post,
  stampCounts
}