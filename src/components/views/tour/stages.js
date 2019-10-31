import React from 'react'
import { withNavigation } from 'react-navigation'
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
  setSkipTour
}) => {
  const pageWidth = Dimensions.get('window').width
  const content = Tour.content[stage]
  const drawerNavigation = navigation.dangerouslyGetParent()
  const rightButtonCallback = {
    0: () => {
      setModalVisible(false)
      drawerNavigation.openDrawer()
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
              rightButtonCallback={rightButtonCallback[0]}
              header={content.header}
              paragraphs={content.paragraphs}
            />
          }
        />
      )
    }
  }
}

const styles = StyleSheet.create({
  0: {
    marginTop: 310
  }
})

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setSkipTour: bool => {
    settingActions.setSkipTour(dispatch, bool)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Stages)))
