import { getActiveAddress } from "./wallet";
import { post, gql, get } from "./arweave";
import { stampCounts, stamp, stampCount } from "./stamps";
import { isVouched } from "./vouched";
import { register } from './warp';
import { query, queryAll, queryRelated, upload } from "./ao"

export default {
  connect: getActiveAddress,
  gql,
  dispatch: post,
  get,
  //contractsByWallet,
  //readState,
  getActiveAddress,
  //deploy,
  post,
  stampCounts,
  stamp,
  stampCount,
  isVouched,
  register,
  query,
  queryAll,
  queryRelated,
  upload
};