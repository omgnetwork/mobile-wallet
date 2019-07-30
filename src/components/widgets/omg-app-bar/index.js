import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Appbar } from 'react-native-paper'
import { IconSource } from 'react-native-paper'

const OMGAppBar = ({
  iconLeft,
  iconRight,
  title,
  alignTitle,
  onIconLeftClick,
  onIconRightClick
}) => {
  const appBarIconLeft = iconLeft && (
    <Appbar.Action
      icon='search'
      onPress={onIconLeftClick}
      styles={styles.iconLeft}
    />
  )

  const appBarIconRight = iconRight && (
    <Appbar.Action
      icon='more-vert'
      onPress={onIconRightClick}
      styles={styles.iconRight}
    />
  )

  console.log(appBarIconLeft)
  console.log(appBarIconRight)

  return (
    <Appbar.Header style={styles.header} dark={false}>
      <Appbar.Content
        style={{ ...styles.content, justifyContent: alignTitle }}
        title={title}
      />
      {appBarIconLeft}
      {appBarIconRight}
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  header: {
    // flex: 1
  },
  content: {
    flex: 1,
    textAlign: 'center'
  },
  iconLeft: {
    justifyContent: 'flex-start'
  },
  iconRight: {
    justifyContent: 'flex-end'
  }
})

OMGAppBar.propTypes = {
  iconLeft: PropTypes.any,
  iconRight: PropTypes.any,
  title: PropTypes.string,
  alignTitle: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
  onIconLeftClick: PropTypes.func,
  onIconRightClick: PropTypes.func
}

OMGAppBar.defaultProps = {
  iconLeft: null,
  iconRight: null,
  title: 'Title',
  alignTitle: 'center',
  onIconLeftClick: () => {},
  onIconRightClick: () => {}
}

export default OMGAppBar
