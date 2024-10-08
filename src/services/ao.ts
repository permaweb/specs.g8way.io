import { createDataItemSigner, dryrun, message } from "@permaweb/aoconnect"
import { Spec } from "src/types/Spec"
// const SPEC_PID = "6x68KURcD4ySOslFCxiIorjsbpzNy6WD4joH6C8VHgg"

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
    process: "6x68KURcD4ySOslFCxiIorjsbpzNy6WD4joH6C8VHgg",
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
    process: "6x68KURcD4ySOslFCxiIorjsbpzNy6WD4joH6C8VHgg",
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
    process: "6x68KURcD4ySOslFCxiIorjsbpzNy6WD4joH6C8VHgg",
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
    process: "6x68KURcD4ySOslFCxiIorjsbpzNy6WD4joH6C8VHgg",
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