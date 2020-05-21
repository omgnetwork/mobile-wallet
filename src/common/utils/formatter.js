import { Datetime, Locale } from 'common/utils'

export const format = (number, { maxDecimal }) => {
  const preformattedNumber = Number(number.toString().replace(',', '.'))
  const [_, region] = Locale.getLocale().split('_')
  return preformattedNumber.toLocaleString(
    [`${region.toLowerCase()}-${region}`],
    {
      maximumFractionDigits: maxDecimal
    }
  )
}

export const formatTimeStamp = (timestamp, formatToken) => {
  const datetime = Datetime.fromTimestamp(timestamp)
  return Datetime.format(datetime, formatToken)
}

export const formatTimeStampFromNow = timestamp => {
  const datetime = Datetime.fromTimestamp(timestamp)
  return datetime.fromNow()
}
