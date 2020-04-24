import { Dimensions } from 'react-native'

export const getResponsiveSize = (defaultSize, { small, medium }) => {
  const widthRatio = getWidthRatio()
  const aspectRatio = getAspectRatio()

  if (widthRatio <= 2.25) {
    return small
  } else if (widthRatio <= 2.75 && aspectRatio < 1.8) {
    return medium
  } else {
    return defaultSize
  }
}

const getWidthRatio = () => {
  return Dimensions.get('window').width / 160
}

const getAspectRatio = () => {
  return Dimensions.get('window').height / Dimensions.get('window').width
}
