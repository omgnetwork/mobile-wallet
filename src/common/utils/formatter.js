import 'ethers/dist/shims.js'
import { ethers } from 'ethers'
import { Datetime, BigNumber } from 'common/utils'

export const formatEther = wei => {
  return ethers.utils.formatEther(wei)
}

export const formatUnits = (amount, numberOfDecimals) => {
  return ethers.utils.formatUnits(amount, numberOfDecimals)
}

export const formatComma = (number, commify) => {
  if (commify) {
    return ethers.utils.commify(number)
  }
}

export const format = (number, { commify, maxDecimal, ellipsize }) => {
  const stringNumber = number.toString()
  const result = formatDecimal(stringNumber, maxDecimal)
  let formattingNumber = result.number

  formattingNumber = formatComma(formattingNumber, commify) || formattingNumber

  return formatEllipsize(formattingNumber, ellipsize && result.exceed)
}

export const formatDecimal = (number, maxDecimal) => {
  let actualMaxDecimal = maxDecimal || 2
  const [integer, decimal] = number.split('.')
  if (decimal && decimal.length > actualMaxDecimal) {
    return {
      exceed: true,
      number: [integer, '.', decimal.substring(0, maxDecimal)].join('')
    }
  }
  return { exceed: false, number }
}

export const formatEllipsize = (number, ellipsize) => {
  if (ellipsize) {
    return number + '...'
  }
  return number
}

export const formatTimeStamp = (timestamp, formatToken) => {
  const datetime = Datetime.fromTimestamp(timestamp)
  return Datetime.format(datetime, formatToken)
}

export const formatTimeStampFromNow = timestamp => {
  const datetime = Datetime.fromTimestamp(timestamp)
  return datetime.fromNow()
}
