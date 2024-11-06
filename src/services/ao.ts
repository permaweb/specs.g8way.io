import { createDataItemSigner, dryrun, message, result } from "@permaweb/aoconnect"
import { compose, head, propOr } from "ramda"
import { Spec } from "src/types/Spec"
const SPEC_PID = "6x68KURcD4ySOslFCxiIorjsbpzNy6WD4joH6C8VHgg"
const VOUCH_PID = "ZTTO02BL2P-lseTLUgiIPD9d0CF1sc4LbMA2AQ7e9jo"
const VOUCHER_WHITELIST = [
  "Ax_uXyLQBPZSQ15movzv9-O1mDo30khslqN64qD27Z8", // Vouch-X
  "k6p1MtqYhQQOuTSfN8gH7sQ78zlHavt8dCDL88btn9s", // Vouch-Gitcoin-Passport
  "QeXDjjxcui7W2xU08zOlnFwBlbiID4sACpi0tSS3VgY", // Vouch-AO-Balance
  "3y0YE11i21hpP8UY0Z1AVhtPoJD4V_AbEBx-g0j9wRc", // Vouch-wAR-Stake
]
const MIN_VOUCH_SCORE = 2
export const upload = async (md: {
  data: string
  tags: {
    name: string
    value: string
  }[]
}) => {
  const getTag = (n: string): string | undefined => 
    md.tags.find(tag => tag.name === n)?.value

  const args = {
    process: SPEC_PID,
    tags: [
      {
        name: "Action",
        value: "Upload"
      },
      {
        name: "Spec-DataProtocol",
        value: getTag('Data-Protocol')
      },
      {
        name: "Spec-GroupId",
        value: getTag('GroupId')
      },
      {
        name: "Spec-Variant",
        value: getTag('Variant')
      },
      {
        name: "Spec-Title",
        value: getTag('Title')
      },
      {
        name: "Spec-Description",
        value: getTag('Description')
      },
      {
        name: "Spec-Topics",
        value: getTag('Topics').toString()
      },
      {
        name: "Spec-Authors",
        value: getTag('Authors').toString()
      },
      {
        name: "Spec-Type",
        value: getTag('Type')
      },
      {
        name: "Spec-Forks",
        value: getTag('Forks')
      },
      {
        name: "Spec-Content-Type",
        value: getTag('Content-Type')
      },
      {
        name: "Spec-Render-With",
        value: getTag('Render-With')
      },
    ],
    data: md.data,
    signer: createDataItemSigner(window.arweaveWallet)
  }

  const result = await message(args)

  return result
}

export const query = async (tx: string) => {
  const args = {
    process: SPEC_PID,
    tags: [
      {
        name: "Action",
        value: "Query"
      },
      {
        name: "txId",
        value: tx
      }
    ],
  }
  const result = await dryrun(args)
  const data = JSON.parse(result.Output.data)

  return data
}
export const queryAll = async () => {
  const args = {
    process: SPEC_PID,
    tags: [
      {
        name: "Action",
        value: "Query-All"
      }
    ],
  }
  const result = await dryrun(args)
  const data: Spec[] = JSON.parse(result.Output.data)

  return data
}

export const queryRelated = async (tx: string) => {
  const args = {
    process: SPEC_PID,
    tags: [
      {
        name: "Action",
        value: "Query-Related"
      },
      {
        name: "txId",
        value: tx
      }
    ],
  }

  const result = await dryrun(args)
  const data: Spec[] = JSON.parse(result.Output.data)

  return data
}

export const isVouched = async (tx: string) => {
  const args = {
    process: VOUCH_PID,
    tags: [
      {
        name: "Action",
        value: "Get-Vouches"
      },
      {
        name: "ID",
        value: tx
      }
    ],
    signer: createDataItemSigner(window.arweaveWallet)
  }

  const messageId = await message(args)

  const resultArgs = {
    process: VOUCH_PID,
    message: messageId,
  }
  const messageResult = await result(resultArgs)

  const vouchers = compose(
    propOr({}, 'Vouchers'),
    JSON.parse,
    propOr('{}', 'Data'),
    head,
    propOr([], 'Messages')
  )(messageResult)

  let vouchScore = 0
  for (const voucher of Object.keys(vouchers)) {
    if (VOUCHER_WHITELIST.includes(voucher)) {
      const vouch = vouchers[voucher]
      const vouchFor = vouch['Vouch-For']
      if (vouchFor != tx) {
        throw new Error('Vouch has Vouch-For mismatch')
      }
      const valueStr = vouch['Value'].match(/^(\d+\.\d+)|(\d+)/g)?.[0] ?? "0"
      const value = parseFloat(valueStr)
      if (valueStr == null || value == null) {
        throw new Error('Vouch has invalid Value')
      }
      vouchScore += value
    }
  }
  return { addr: tx, vouched: Boolean(vouchScore > MIN_VOUCH_SCORE) }
}