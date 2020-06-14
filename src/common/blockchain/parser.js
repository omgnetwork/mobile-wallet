import { ethers } from 'ethers'

export const parseBytes32 = bytes32 => {
  return ethers.utils.parseBytes32String(bytes32)
}
