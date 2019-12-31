import { Parser, BigNumber, Formatter } from 'common/utils'
import { Gas } from 'common/constants'

// Output in ETH
export const renderGasFee = (gasUsed, gasPriceWei, flatFee = '0') => {
  const bigNumberFlatFee = BigNumber.create(flatFee)
  const bigNumberGasPriceWei = BigNumber.create(gasPriceWei)
  const bigNumberGasUsed = BigNumber.create(gasUsed)
  const bigNumberGasFee = bigNumberGasPriceWei.mul(bigNumberGasUsed)
  const bigNumberTotalFee = bigNumberGasFee.add(bigNumberFlatFee)
  return Formatter.formatUnits(bigNumberTotalFee, 18)
}

// Output in USD
export const renderGasFeeUsd = (gasUsed, gasPriceWei, usdEth) => {
  const bigNumberGasPriceWei = BigNumber.create(gasPriceWei)
  const bigNumberGasUsed = BigNumber.create(gasUsed)
  const bigNumberGasFee = bigNumberGasPriceWei.mul(bigNumberGasUsed)
  const gasFeeString = Formatter.formatUnits(bigNumberGasFee, 18)
  return Formatter.format(BigNumber.multiply(gasFeeString, usdEth), {
    commify: true,
    maxDecimal: 3,
    eliipsize: false
  })
}

export const renderFeeEth = gweiFee => {
  if (!gweiFee) return '0'
  const weiFee = Parser.parseUnits(gweiFee, 'gwei')
  return Formatter.formatUnits(weiFee, 'ether')
}

export function renderEstimatedTotalFee(
  isRootchain,
  gasPrice,
  estimatedGasUsed = Gas.MINIMUM_GAS_USED
) {
  return BigNumber.multiply(gasPrice, isRootchain ? estimatedGasUsed : 1)
}

export const renderTokenBalance = (amount, maxDecimal = 18) => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: maxDecimal,
    ellipsize: false
  })
}

export const renderTokenBalanceFromSmallestUnit = (amount, maxDecimal = 18) => {
  const balance = Formatter.formatUnits(amount.toString(), maxDecimal)
  return Formatter.format(balance, {
    commify: true,
    maxDecimal: maxDecimal,
    ellipsize: false
  })
}

export const renderTokenPrice = (amount, price = 1) => {
  const tokenPrice = BigNumber.multiply(amount, price)
  return Formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

export const renderTotalPrice = (tokenPrice, feePrice) => {
  const totalPrice = BigNumber.plus(tokenPrice, feePrice)
  return Formatter.format(totalPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}
