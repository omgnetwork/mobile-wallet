import BigNumber from 'bignumber.js'

/**
 * Convert a number from given unit to another unit.
 * i.e. convert a number with `gwei` unit (9) to a number with `wei` unit. (18)
 *
 * For example:
 * > convert(1, 9, 18)
 * > 1_000_000_000
 *
 * > convert(1_000_000_000, 18, 9)
 * > 1
 *
 * @param {BN|BigDecimal|Number|String} amount
 * @param {Number|String} fromUnit
 * @param {Number|String} toUnit
 */

// Supported only units being used in the app
const unitMap = {
  ether: 0,
  gwei: 9,
  wei: 18
}

export const convert = (amount, fromUnit, toUnit) => {
  const stringAmount = amount.toString(10).replace(',', '.')
  const from =
    typeof fromUnit === 'string' ? unitMap[fromUnit.toLowerCase()] : fromUnit
  const to = typeof toUnit === 'string' ? unitMap[toUnit.toLowerCase()] : toUnit

  if (from !== 0 && !from) {
    throw new Error(`Unsupported unit ${fromUnit}`)
  }
  if (to !== 0 && !to) {
    throw new Error(`Unsupported unit ${toUnit}`)
  }

  const multiplier = new BigNumber(10).exponentiatedBy(to - from)

  return new BigNumber(stringAmount).times(multiplier)
}

export const convertToString = (amount, fromUnit, toUnit, base = 10) => {
  return convert(amount, fromUnit, toUnit).toString(base)
}
