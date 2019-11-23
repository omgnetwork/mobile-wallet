import { Parser, BigNumber, Formatter } from 'common/utils'

// Output in ETH
export const renderGasFee = (gasUsed, gasPriceWei) => {
  const bigNumberGasPriceWei = BigNumber.create(gasPriceWei)
  const bigNumberGasUsed = BigNumber.create(gasUsed)
  const bigNumberGasFee = bigNumberGasPriceWei.mul(bigNumberGasUsed)
  return Formatter.formatUnits(bigNumberGasFee, 18)
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

export const renderTokenBalance = (amount, maxDecimal = 18) => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: maxDecimal,
    ellipsize: false
  })
}

export const renderTokenBalanceFromSmallestUnit = (amount, maxDecimal = 18) => {
  const balance = Formatter.formatUnits(amount, maxDecimal)
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