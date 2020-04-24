import { ethers } from 'ethers'
import { Parser } from 'common/blockchain'
import { BigNumber, Formatter, Datetime } from 'common/utils'
import { DateFormat } from 'common/constants'

export const formatUnits = (wei, decimalsOrUnitName) => {
  return ethers.utils.formatUnits(
    wei,
    Number(decimalsOrUnitName) || decimalsOrUnitName
  )
}

// Output in ETH
export const formatGasFee = (gasUsed, gasPriceWei, flatFee = '0') => {
  if (!gasUsed) return '0'

  const bigNumberFlatFee = BigNumber.create(flatFee)
  const bigNumberGasPriceWei = BigNumber.create(gasPriceWei)
  const bigNumberGasUsed = BigNumber.create(gasUsed)
  const bigNumberGasFee = bigNumberGasPriceWei.mul(bigNumberGasUsed)
  const bigNumberTotalFee = bigNumberGasFee.add(bigNumberFlatFee)
  return formatUnits(bigNumberTotalFee, 18)
}

// Output in USD
export const formatGasFeeUsd = (
  gasUsed,
  gasPriceWei,
  usdEth,
  flatFee = '0'
) => {
  const bigNumberGasPriceWei = BigNumber.create(gasPriceWei)
  const bigNumberGasUsed = BigNumber.create(gasUsed)
  const bigNumberGasFee = bigNumberGasPriceWei.mul(bigNumberGasUsed)
  const gasFeeString = formatUnits(bigNumberGasFee, 18)
  return Formatter.format(BigNumber.multiply(gasFeeString, usdEth), {
    maxDecimal: 2
  })
}

export const formatEthFromWei = wei => {
  if (!wei) return '0'
  const weiFee = Parser.parseUnits(wei, 'wei')
  return formatUnits(weiFee, 'ether')
}

export const formatProcessExitAt = datetime => {
  const unix = Datetime.fromTimestamp(datetime)
  return ` ${Datetime.format(unix, DateFormat.PROCESS_EXIT_DATE)}. `
}

export const formatTokenBalance = (amount, maxDecimal = 18) => {
  return Formatter.format(amount, {
    maxDecimal: maxDecimal
  })
}

export const formatTokenBalanceFromSmallestUnit = (
  amount,
  tokenDecimal = 18,
  displayDecimals = 5
) => {
  const balance = formatUnits(amount.toString(), tokenDecimal)
  return Formatter.format(balance, {
    maxDecimal: displayDecimals
  })
}

export const formatTokenPrice = (amount, price = 1) => {
  const tokenPrice = BigNumber.multiply(amount, price)
  return Formatter.format(tokenPrice, {
    maxDecimal: 2
  })
}

export const formatTotalPrice = (tokenPrice, feePrice) => {
  const totalPrice = BigNumber.plus(tokenPrice, feePrice)
  return Formatter.format(totalPrice, {
    maxDecimal: 2
  })
}

export const formatTotalEthAmount = (token, feeAmount) => {
  const totalAmount = BigNumber.plus(token.balance, feeAmount)
  return Formatter.format(totalAmount, {
    maxDecimal: 18
  })
}
