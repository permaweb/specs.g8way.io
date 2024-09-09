import { prop, path } from "ramda";
import {
  DeployPlugin,
  InjectedArweaveSigner,
} from "warp-contracts-plugin-deploy";
import { WarpFactory, LoggerFactory } from "warp-contracts";

LoggerFactory.INST.logLevel("fatal");
const warp = WarpFactory.forMainnet().use(new DeployPlugin());

const AGG = "https://contracts-u.warp.cc";
const DRE = "https://dre-u.warp.cc/contract";

const options = {
  allowBigInt: true,
  internalWrites: true,
  unsafeClient: "skip" as const,
  remoteStateSyncEnabled: true,
};
export const contractsByWallet = (addr: string) =>
  fetch(`${AGG}/balances?walletAddress=${addr}`)
    .then((res) => res.json())
    .then(prop("balances"));

export const register = (tx) => warp.register(tx, 'node2')

export const readState = (tx) =>
  warp
    .contract(tx)
    .setEvaluationOptions(options)
    .readState()
    .catch(() =>
      warp
        .contract(tx)
        .setEvaluationOptions({
          ...options,
          remoteStateSyncSource: "https://dre-u.warp.cc/contract",
        })
        .readState(),
    )
    .then(path(["cachedValue", "state"]));

export const deploy = async (contract) => {
  console.log("contract", contract);

  const userSigner = new InjectedArweaveSigner(window.arweaveWallet);
  await userSigner.setPublicKey();

  return await warp
    .deployFromSourceTx({
      wallet: userSigner as any, // TODO: fix this
      initState: JSON.stringify(contract.initState),
      srcTxId: contract.contractSrc,
      tags: contract.tags,
    })
    .then((x) => (console.log("result", x), x))
    .catch((x) => console.log(x));
  //disable bundling
};