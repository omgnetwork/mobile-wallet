import { Gas } from 'common/constants'
import { BigNumber } from 'common/utils'

export function calculatePlasmaFeeUSD(tokenPrice, feeAmount) {
  return BigNumber.multiply(tokenPrice, feeAmount).toString(10)
}

export function calculateEstimatedTotalFee(
  isRootchain,
  gasPrice,
  estimatedGasUsed = Gas.MINIMUM_GAS_USED
) {
  return BigNumber.multiply(gasPrice, isRootchain ? estimatedGasUsed : 1)
}

export function calculateGasFeeEth(gasPrice, gasUsed) {
  return BigNumber.multiply(gasPrice, gasUsed)
}

export function calculateGasFeeUsd(gasPrice, gasUsed, ethPrice) {
  const gasFeeEth = calculateGasFeeEth(gasPrice, gasUsed)
  return BigNumber.multiply(gasFeeEth, ethPrice)
}
