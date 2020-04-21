import { Dimensions } from 'react-native'

export const getResponsiveSize = (defaultSize, { small, medium }) => {
  const widthRatio = getWidthRatio()
  const aspectRatio = getAspectRatio()
  if (aspectRatio > 2 || widthRatio > 2.75) {
    return defaultSize
  } else if (widthRatio > 2.25) {
    return medium
  } else {
    return small
  }
}

const getWidthRatio = () => {
  return Dimensions.get('window').width / 160
}

const getAspectRatio = () => {
  return Dimensions.get('window').height / Dimensions.get('window').width
}
