import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import OMGBackground from '../omg-background'

const OMGRadioButton = ({ choices, onSelected }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const radioButtons = choices.map((choice, index) => (
    <Button
      mode='outlined'
      key={index}
      onPress={() => setSelectedIndex(index)}
      color={selectedIndex === index ? '#334e68' : '#D9E2EC'}
      style={{
        marginRight: 16,
        width: 'auto',
        height: 40,
        borderColor: selectedIndex === index ? '#334e68' : '#D9E2EC'
      }}>
      {choice}
    </Button>
  ))

  useEffect(() => {
    onSelected(selectedIndex)
  }, [onSelected, selectedIndex])

  return (
    <OMGBackground style={{ height: 80 }}>
      <ScrollView horizontal={true}>
        <View style={{ flexDirection: 'row', paddingVertical: 16 }}>
          {radioButtons}
        </View>
      </ScrollView>
    </OMGBackground>
  )
}

OMGRadioButton.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelected: PropTypes.func
}

OMGRadioButton.defaultProps = {
  onSelected: () => {}
}

export default OMGRadioButton
