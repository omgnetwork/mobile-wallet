import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export const create = number => {
  return ethers.utils.bigNumberify(number)
}

export const multiply = (a, b) => {
  return new BigNumber(a).times(new BigNumber(b)).toString(10)
}

export const plus = (a, b) => {
  const bnA = new BigNumber(a)
  const bnB = new BigNumber(b)
  const result = bnA.plus(bnB)
  const minDecimalPlaces = Math.min(bnA.dp(), bnB.dp())
  return result.dp(minDecimalPlaces, BigNumber.ROUND_UP).toString(10)
}

export const minus = (a, b) => {
  return new BigNumber(a).minus(new BigNumber(b)).toString(10)
}

export const divide = (a, b) => {
  return new BigNumber(a).div(new BigNumber(b)).toString(10)
}
