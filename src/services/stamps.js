import Stamps from '@permaweb/stampjs'
import { WarpFactory } from 'warp-contracts/web'
import { prop } from 'ramda'

const stamps = Stamps.init({ warp: WarpFactory.forMainnet() })

export const stampCounts = (txs) => stamps.counts(txs)

export const stamp = tx => stamps.stamp(tx)

export const stampCount = (tx) => stamps.count(tx).then(prop('vouched'))