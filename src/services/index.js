import { contractsByWallet, readState, deploy } from './warp'
import { getActiveAddress } from './wallet'
import { post } from './arweave'

export default {
  connect: getActiveAddress,
  dispatch: post,
  contractsByWallet,
  readState,
  getActiveAddress,
  deploy,
  post
}