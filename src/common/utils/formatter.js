import * as ethersUtils from './ethers'

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

export const formatComma = (number, commify) => {
  if (commify) {
    return ethersUtils.commify(number)
  }
}

export const formatEllipsize = (number, ellipsize) => {
  if (ellipsize) {
    return number + '...'
  }
  return number
}
