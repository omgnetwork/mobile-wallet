import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'

const OMGIcon = ({ name, color, size, onPress }) => {
  return <Icon name={name} color={color} size={size} onPress={onPress} />
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
