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
import { Styles } from 'common/utils'

const OMGActionSheetMenus = ({
  theme,
  isVisible,
  setVisible,
  enableDeposit,
  enableWithdraw,
  onPressDeposit,
  onPressWithdraw
}) => {
  const styles = createStyles(theme)
  return (
    <OMGActionSheetContainer isVisible={isVisible} setVisible={setVisible}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            onPressDeposit()
            if (enableDeposit) setVisible(false)
          }}>
          <View style={[styles.row, styles.contentContainer(enableDeposit)]}>
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
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          onPress={() => {
            onPressWithdraw()
            if (enableWithdraw) setVisible(false)
          }}>
          <View style={[styles.row, styles.contentContainer(enableDeposit)]}>
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
          </View>
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
    contentContainer: enable => ({
      opacity: enable ? 1.0 : 0.3
    }),
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
      paddingVertical: Styles.getResponsiveSize(28, { small: 16, medium: 20 })
    },
    textMenu: {
      color: theme.colors.black5,
      fontSize: Styles.getResponsiveSize(16, { small: 14, medium: 14 }),
      lineHeight: Styles.getResponsiveSize(19, { small: 16, medium: 16 }),
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

const mapStateToProps = (state, _ownProps) => ({
  primaryWalletNetwork: state.setting.primaryWalletNetwork
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchSetPrimaryWallet: (wallet, network) =>
    settingActions.setPrimaryWallet(dispatch, wallet.address, network),
  dispatchToggleWalletSwitcher: visible =>
    walletSwitcherActions.toggle(dispatch, visible)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(OMGActionSheetMenus)))
