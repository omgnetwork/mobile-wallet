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

export const combine = (defaultStyle, { small, medium }) => {
  const widthRatio = getWidthRatio()
  const aspectRatio = getAspectRatio()
  if (aspectRatio > 2 || widthRatio >= 2.75) {
    return defaultStyle
  } else if (widthRatio > 2.25) {
    return merge(defaultStyle, medium)
  } else {
    return merge(defaultStyle, small)
  }
}

const getWidthRatio = () => {
  return Dimensions.get('window').width / 160
}

const getAspectRatio = () => {
  return Dimensions.get('window').height / Dimensions.get('window').width
}

const merge = (target, source) => {
  let output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = merge(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}
