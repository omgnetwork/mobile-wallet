import { ethers } from 'ethers'

export const parseUnits = (tokenBalance, tokenNumberOfDecimals) => {
  return ethers.utils.parseUnits(tokenBalance, tokenNumberOfDecimals)
}
