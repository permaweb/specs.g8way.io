import { contractsByWallet, readState, deploy } from './warp'
import { getActiveAddress } from './wallet'
import { post } from './arweave'

export default {
  contractsByWallet,
  readState,
  getActiveAddress,
  deploy,
  post
}