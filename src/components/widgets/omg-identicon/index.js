import React from 'react'
import { View } from 'react-native'
import { Identicon } from 'common/utils'
import { SvgXml } from 'react-native-svg'

const defaultConfig = {
  lightness: {
    color: [0.41, 0.66],
    grayscale: [0.45, 0.5]
  },
  saturation: {
    color: 0.55,
    grayscale: 0.56
  },
  backColor: '#6d71dc00'
}

const OMGIdenticon = ({ hash, size, style, config }) => {
  const xml = Identicon.create(hash, size, config || defaultConfig)

  return (
    <View style={style}>
      <SvgXml xml={xml} />
    </View>
  )
}

export default OMGIdenticon
