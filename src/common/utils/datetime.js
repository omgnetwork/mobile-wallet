import moment from 'moment'

export const now = () => {
  return moment.utc().format()
}

export const format = (datetime, token) => {
  return moment(datetime).format(token)
}
