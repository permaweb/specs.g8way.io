import Arweave from 'arweave'

const arweave = import.meta.env.MODE === 'development' ?
  Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' }) :
  Arweave.init({})

export const post = async (data, tags) => {
  try {
    const tx = await arweave.createTransaction({ data })
    tags.map(t => tx.addTag(t.name, t.value))
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
    return Promise.resolve({ id: tx.id })
  } catch (e) {
    console.log(e.message)
    return Promise.reject(e)
  }
}
