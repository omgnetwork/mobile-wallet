import { Notification } from 'common/utils'

export const sendNotification = ({ title, message }) => {
  return Notification.create({ title, message })
}
