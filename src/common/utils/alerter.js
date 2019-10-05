import { showMessage } from 'react-native-flash-message'

export const show = ({ type, message }) => {
  showMessage({
    message,
    type,
    hideOnPress: true
  })
}
