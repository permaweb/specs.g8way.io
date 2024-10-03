import { getActiveAddress } from "./wallet";
import { post, gql, get } from "./arweave";
import { stampCounts, stamp, stampCount } from "./stamps";
import { isVouched } from "./vouched";
import { register } from './warp';
import { query, queryAll, queryRelated, upload } from "./ao"
import { Services } from "./dal"


export default {
  connect: getActiveAddress,
  gql,
  dispatch: post,
  get,
  stampCounts,
  stamp,
  stampCount,
  isVouched,
  register,
  query,
  queryAll,
  queryRelated,
  upload
} as Services