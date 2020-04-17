import { Dimensions } from 'react-native'

export const combine = (defaultStyle, { small, medium }) => {
  const ratio = getScreenRatio()
  if (ratio > 3) {
    return defaultStyle
  } else if (ratio > 2) {
    return merge(defaultStyle, medium)
  } else {
    return merge(defaultStyle, small)
  }
}

export const getScreenRatio = () => {
  return Dimensions.get('window').width / 160
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
