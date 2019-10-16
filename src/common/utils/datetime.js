import moment from 'moment'

export const now = () => {
  return moment.utc().format()
}

export const fromTimestamp = timestamp => {
  return moment.unix(timestamp)
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
