import { contractsByWallet, readState, deploy } from './warp'
import { getActiveAddress } from './wallet'
import { post, gql } from './arweave'

export default {
  connect: getActiveAddress,
  gql,
  dispatch: post,
  contractsByWallet,
  readState,
  getActiveAddress,
  deploy,
  post
}