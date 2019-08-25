import { Notification } from 'common/utils'

export const sendNotification = ({ title, message }) => {
  Notification.create({ title, message })
}

export const init = () => {
  Notification.init()
}
