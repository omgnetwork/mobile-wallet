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
  setTourStep
}) => {
  const pageWidth = Dimensions.get('window').width
  const content = Tour.content[stage]
  const drawerNavigation = navigation.dangerouslyGetParent()

  const rightButtonCallback = () => {
    setModalVisible(false)
    setTourStep(stage + 1)
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

  const leftButtonCallback = () => {
    setModalVisible(false)
    const prevStage = stage === 0 ? 0 : stage - 1
    setTourStep(prevStage)
    switch (stage) {
      case 0: {
        setSkipTour(true)
        break
      }
      case 1: {
        drawerNavigation.closeDrawer()
        break
      }
      case 2: {
        setCurrentScrollPage(2)
        drawerNavigation.openDrawer()
      }
    }
  }

  return (
    <OMGModal
      type={content.modalType}
      modalVisible={modalVisible}
      height={380}
      width={pageWidth}
      style={styles[stage]}
      content={
        <Tour.Screen
          rightButtonText={content.buttonTextRight}
          leftButtonText={content.buttonTextLeft}
          leftButtonCallback={leftButtonCallback}
          rightButtonCallback={rightButtonCallback}
          header={content.header}
          paragraphs={content.paragraphs}
        />
      }
    />
  )
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  setSkipTour: bool => {
    settingActions.setSkipTour(dispatch, bool)
  },
  setTourStep: stage => {
    settingActions.setTour(dispatch, stage)
  }
})

export default connect(
  null,
  mapDispatchToProps
)(withNavigation(withTheme(Stages)))
