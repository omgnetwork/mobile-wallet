import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const OMGIcon = ({ name, color, size, onPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Icon name={name} color={color} size={size} />
    </TouchableOpacity>
  )
}

OMGIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  onPress: PropTypes.func
}

OMGIcon.defaultProps = {
  color: '#000000',
  size: 24,
  onPress: () => {}
}

export default OMGIcon
