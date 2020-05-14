import React from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { OMGActionSheetContainer } from 'components/widgets'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import DepositIcon from './assets/ic-deposit'
import WithdrawIcon from './assets/ic-withdraw'
import { settingActions, walletSwitcherActions } from 'common/actions'
import { OMGFontIcon, OMGText } from 'components/widgets'

const OMGActionSheetMenus = ({
  theme,
  isVisible,
  setVisible,
  onPressDeposit,
  onPressWithdraw
}) => {
  const styles = createStyles(theme)

  return (
    <OMGActionSheetContainer isVisible={isVisible} setVisible={setVisible}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.row} onPress={onPressDeposit}>
          <View style={styles.iconContainer}>
            <DepositIcon />
          </View>
          <OMGText style={styles.textMenu} weight='book'>
            Deposit
          </OMGText>
          <OMGFontIcon
            name='chevron-right'
            size={14}
            style={styles.caretRight}
            color={theme.colors.gray2}
          />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.row} onPress={onPressWithdraw}>
          <View style={styles.iconContainer}>
            <WithdrawIcon />
          </View>
          <OMGText style={styles.textMenu} weight='book'>
            Withdraw
          </OMGText>
          <OMGFontIcon
            name='chevron-right'
            size={14}
            style={styles.caretRight}
            color={theme.colors.gray2}
          />
        </TouchableOpacity>
      </View>
    </OMGActionSheetContainer>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      width: Dimensions.get('window').width,
      flexDirection: 'column'
    },
    marginItem: {
      marginTop: 16
    },
    iconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 28
    },
    textMenu: {
      color: theme.colors.black5,
      fontSize: 16,
      lineHeight: 19,
      marginLeft: 26
    },
    caretRight: {
      marginLeft: 'auto'
    },
    divider: {
      opacity: 0.15,
      backgroundColor: theme.colors.gray2,
      height: 1
    }
  })

const mapStateToProps = (state, ownProps) => ({
  primaryWalletNetwork: state.setting.primaryWalletNetwork
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetPrimaryWallet: (wallet, network) =>
    settingActions.setPrimaryWallet(dispatch, wallet.address, network),
  dispatchToggleWalletSwitcher: visible =>
    walletSwitcherActions.toggle(dispatch, visible)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(OMGActionSheetMenus)))
