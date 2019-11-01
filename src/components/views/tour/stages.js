import React from 'react'
import { withNavigation, SwitchActions } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, Dimensions } from 'react-native'

import { settingActions } from 'common/actions'
import { connect } from 'react-redux'

import { OMGModal } from 'components/widgets'
import * as Tour from './index'

const Stages = ({
  theme,
  navigation,
  stage,
  modalVisible,
  setModalVisible,
  setCurrentScrollPage,
  setSkipTour,
  setTourStageTracker
}) => {
  const pageWidth = Dimensions.get('window').width
  const content = Tour.content[stage]
  const drawerNavigation = navigation.dangerouslyGetParent()

  const rightButtonCallback = () => {
    setModalVisible(false)
    setTourStageTracker(stage + 1)
    switch (stage) {
      case 0: {
        drawerNavigation.openDrawer()
        break
      }
      case 1: {
        drawerNavigation.closeDrawer()
        setCurrentScrollPage(3)
        break
      }
      case 2: {
        setCurrentScrollPage(2)
        break
      }
    }
  }

  const leftButtonCallback = {
    0: () => {
      setSkipTour(true)
    }
  }

  switch (stage) {
    case 0: {
      return (
        <OMGModal
          modalVisible={modalVisible}
          height={380}
          width={pageWidth}
          style={styles[0]}
          content={
            <Tour.Screen
              rightButtonText={content.buttonTextRight}
              leftButtonText={content.buttonTextLeft}
              leftButtonCallback={leftButtonCallback[0]}
              rightButtonCallback={rightButtonCallback}
              header={content.header}
              paragraphs={content.paragraphs}
            />
          }
        />
      )
    }

    case 1: {
      return (
        <OMGModal
          type='triangle-up'
          modalVisible={modalVisible}
          height={250}
          width={0.9 * pageWidth}
          style={styles[stage]}
          content={
            <Tour.Screen
              rightButtonText={content.buttonTextRight}
              leftButtonText={content.buttonTextLeft}
              leftButtonCallback={leftButtonCallback[stage]}
              rightButtonCallback={rightButtonCallback}
              header={content.header}
              paragraphs={content.paragraphs}
            />
          }
        />
      )
    }
    case 2: {
      return (
        <OMGModal
          type='triangle-up'
          modalVisible={modalVisible}
          height={220}
          width={0.9 * pageWidth}
          style={styles[stage]}
          content={
            <Tour.Screen
              rightButtonText={content.buttonTextRight}
              leftButtonText={content.buttonTextLeft}
              leftButtonCallback={leftButtonCallback[stage]}
              rightButtonCallback={rightButtonCallback}
              header={content.header}
              paragraphs={content.paragraphs}
            />
          }
        />
      )
    }

    case 3: {
      return (
        <OMGModal
          type='triangle-up'
          modalVisible={modalVisible}
          height={250}
          width={0.9 * pageWidth}
          style={styles[stage]}
          content={
            <Tour.Screen
              rightButtonText={content.buttonTextRight}
              leftButtonText={content.buttonTextLeft}
              leftButtonCallback={leftButtonCallback[stage]}
              rightButtonCallback={rightButtonCallback}
              header={content.header}
              paragraphs={content.paragraphs}
            />
          }
        />
      )
    }

    default: {
      return null
    }
  }
}

const styles = StyleSheet.create({
  0: {
    marginTop: 310
  },
  1: {
    marginTop: 180
  },
  2: {
    marginTop: 540
  },
  3: {
    marginTop: 220
  }
})

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setSkipTour: bool => {
    settingActions.setSkipTour(dispatch, bool)
  },
  setTourStageTracker: stage => {
    settingActions.setTourStageTracker(dispatch, stage)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Stages)))
