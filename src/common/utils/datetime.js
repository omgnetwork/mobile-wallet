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
