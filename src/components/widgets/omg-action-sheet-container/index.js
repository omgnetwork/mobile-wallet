import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { OMGText } from 'components/widgets'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { walletSwitcherActions } from 'common/actions'

const OMGActionSheetContainer = ({
  theme,
  children,
  isVisible = false,
  dispatchToggleWalletSwitcher
}) => {
  const styles = createStyles(theme)
  return (
    <Modal
      coverScreen={false}
      style={styles.modal}
      useNativeDriver={false}
      onBackdropPress={() => dispatchToggleWalletSwitcher(false)}
      onSwipeComplete={() => dispatchToggleWalletSwitcher(false)}
      hideModalContentWhileAnimating={false}
      swipeDirection={['down']}
      isVisible={isVisible}>
      <View style={styles.popupModalContainer}>
        <View style={styles.puller} />
        {children}
      </View>
    </Modal>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    modal: {
      marginHorizontal: 0,
      marginVertical: 0,
      justifyContent: 'flex-end'
    },
    popupModalContainer: {
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 24,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.colors.white
    },
    puller: {
      width: 100,
      height: 3,
      backgroundColor: theme.colors.gray2
    }
  })

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchToggleWalletSwitcher: visible =>
    walletSwitcherActions.toggle(dispatch, visible)
})

export default connect(
  null,
  mapDispatchToProps
)(withTheme(OMGActionSheetContainer))
