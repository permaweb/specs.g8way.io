//import { contractsByWallet, readState, deploy } from "./warp";
import { getActiveAddress } from "./wallet";
import { post, gql, get, bundlr } from "./arweave";
import { stampCounts, stamp, stampCount } from "./stamps";
import { isVouched } from "./vouched";

export default {
  connect: getActiveAddress,
  gql,
  bundlr,
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
};
