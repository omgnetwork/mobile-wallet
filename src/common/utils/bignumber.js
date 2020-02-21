import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export const create = number => {
  return ethers.utils.bigNumberify(number)
}

export const multiply = (a, b) => {
  return new BigNumber(a).times(new BigNumber(b)).toString(10)
}

export const plus = (a, b) => {
  return new BigNumber(a).plus(new BigNumber(b)).toString(10)
}

export const minus = (a, b) => {
  return new BigNumber(a).minus(new BigNumber(b)).toString(10)
}

export const divide = (a, b) => {
  return new BigNumber(a).divide(new BigNumber(b).toString(10))
}
