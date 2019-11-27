import 'ethers/dist/shims.js'
import { ethers } from 'ethers'

export const create = number => {
  return ethers.utils.bigNumberify(number)
}
