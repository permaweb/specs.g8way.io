import { getActiveAddress } from "./wallet";
import { post, gql, get } from "./arweave";
import { stampCounts, stamp, stampCount } from "./stamps";
import { isVouched } from "./vouched";
import { query, queryAll, queryRelated, upload } from "./ao"
import { Services } from "../dal"


const services: Services = {
  connect: getActiveAddress,
  gql,
  dispatch: post,
  get,
  stampCounts,
  stamp,
  stampCount,
  isVouched,
  query,
  queryAll,
  queryRelated,
  upload
}

export default services