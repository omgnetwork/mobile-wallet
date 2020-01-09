import { ethers } from 'ethers'

export const parseUnits = (tokenBalance, tokenNumberOfDecimals) => {
  return ethers.utils.parseUnits(tokenBalance, tokenNumberOfDecimals)
}

export const parseBytes32 = bytes32 => {
  return ethers.utils.parseBytes32String(bytes32)
}
