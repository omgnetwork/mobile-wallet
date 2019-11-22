import 'ethers/dist/shims.js'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export const create = number => {
  return ethers.utils.bigNumberify(number)
}

export const multiply = (a, b) => {
  return new BigNumber(a).times(new BigNumber(b)).toString(10)
}
