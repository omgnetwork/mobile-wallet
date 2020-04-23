import { ethers } from 'ethers'
import { Datetime } from 'common/utils'

export const format = (number, { maxDecimal }) => {
  const preformattedNumber = Number(number.toString())
  return preformattedNumber.toLocaleString(undefined, {
    maximumFractionDigits: maxDecimal
  })
}

export const formatTimeStamp = (timestamp, formatToken) => {
  const datetime = Datetime.fromTimestamp(timestamp)
  return Datetime.format(datetime, formatToken)
}

export const formatTimeStampFromNow = timestamp => {
  const datetime = Datetime.fromTimestamp(timestamp)
  return datetime.fromNow()
}
