import Stamps from '@permaweb/stampjs'
import { WarpFactory } from 'warp-contracts/web'

const stamps = Stamps.init({ warp: WarpFactory.forMainnet() })

export const stampCounts = (txs) => stamps.counts(txs)
