import { Parser, BigNumber, Formatter, Datetime } from 'common/utils'
import { DateFormat } from 'common/constants'

// Output in ETH
export const formatGasFee = (gasUsed, gasPriceWei, flatFee = '0') => {
  const bigNumberFlatFee = BigNumber.create(flatFee)
  const bigNumberGasPriceWei = BigNumber.create(gasPriceWei)
  const bigNumberGasUsed = BigNumber.create(gasUsed)
  const bigNumberGasFee = bigNumberGasPriceWei.mul(bigNumberGasUsed)
  const bigNumberTotalFee = bigNumberGasFee.add(bigNumberFlatFee)
  return Formatter.formatUnits(bigNumberTotalFee, 18)
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
  const gasFeeString = Formatter.formatUnits(bigNumberGasFee, 18)
  return Formatter.format(BigNumber.multiply(gasFeeString, usdEth), {
    commify: true,
    maxDecimal: 3,
    ellipsize: false
  })
}

export const formatEthFromWei = wei => {
  if (!wei) return '0'
  const weiFee = Parser.parseUnits(wei, 'wei')
  return Formatter.formatUnits(weiFee, 'ether')
}

export const formatProcessExitAt = datetime => {
  return ` ${Datetime.format(datetime, DateFormat.processExitDateFormat)}. `
}

export const formatTokenBalance = (amount, maxDecimal = 18) => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: maxDecimal,
    ellipsize: false
  })
}

export const formatTokenBalanceFromSmallestUnit = (
  amount,
  tokenDecimal = 18,
  displayDecimals = 5
) => {
  const balance = Formatter.formatUnits(amount.toString(), tokenDecimal)
  return Formatter.format(balance, {
    commify: true,
    maxDecimal: displayDecimals,
    ellipsize: false
  })
}

export const formatTokenPrice = (amount, price = 1) => {
  const tokenPrice = BigNumber.multiply(amount, price)
  return Formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

export const formatTotalPrice = (tokenPrice, feePrice) => {
  const totalPrice = BigNumber.plus(tokenPrice, feePrice)
  return Formatter.format(totalPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

export const formatTotalEthAmount = (token, feeAmount) => {
  const totalAmount = BigNumber.plus(token.balance, feeAmount)
  return Formatter.format(totalAmount, {
    commify: true,
    maxDecimal: 18,
    ellipsize: false
  })
}
