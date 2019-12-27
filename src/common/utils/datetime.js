import moment from 'moment'

export const now = () => {
  return moment.utc().format()
}

export const timestamp = () => {
  return moment().unix()
}

export const fromTimestamp = ts => {
  return moment.unix(ts)
}

export const toTimestamp = datetimeString => {
  return fromString(datetimeString).format('X')
}

export const format = (datetime, token) => {
  return moment(datetime).format(token || 'LTS')
}

export const fromString = datetimeString => {
  return moment(datetimeString)
}

export const fromNow = () => {
  return moment()
}

export const add = (currentMoment, duration) => {
  return currentMoment.add(duration, 'milliseconds')
}
