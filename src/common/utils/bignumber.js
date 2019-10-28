import 'ethers/dist/shims.js'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export const create = number => {
  return ethers.utils.bigNumberify(number)
}
