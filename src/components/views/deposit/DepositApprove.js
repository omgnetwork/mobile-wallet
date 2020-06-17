import React from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGTokenIcon, OMGButton } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'
import { plasmaActions } from 'common/actions'

const DepositApprove = ({ theme, navigation }) => {
  const styles = createStyles(theme)
  const feeRate = navigation.getParam('feeRate')
  const amount = navigation.getParam('amount')
  const token = navigation.getParam('token')
  const address = navigation.getParam('address')

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='regular'>
        APPROVE {token.symbol} TOKEN
      </OMGText>
      <OMGText style={styles.description}>
        Please approve to move {amount} {token.tokenSymbol} from Ethereum to the
        OMG Network.
      </OMGText>
      <View style={styles.tokenContainer}>
        <OMGTokenIcon token={token} size={28} />
        <View style={styles.tokenDetailContainer}>
          <OMGText weight='regular' style={styles.textTokenDetail}>
            Token Contract Address
          </OMGText>
          <OMGText
            style={[styles.textTokenDetail, styles.smallMarginTop]}
            ellipsizeMode='middle'
            numberOfLines={1}>
            {token.contractAddress}
          </OMGText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <OMGButton>Approve</OMGButton>
      </View>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.colors.black5,
      paddingHorizontal: Styles.getResponsiveSize(26, {
        small: 12,
        medium: 16
      }),
      paddingBottom: 16
    },
    title: {
      color: theme.colors.white
    },
    description: {
      color: theme.colors.gray6,
      fontSize: 12,
      marginTop: 8,
      lineHeight: 16
    },
    tokenContainer: {
      flexDirection: 'row',
      marginTop: 24,
      borderRadius: 8,
      backgroundColor: theme.colors.black2,
      paddingHorizontal: 16,
      paddingVertical: 16
    },
    tokenDetailContainer: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 12,
      justifyContent: 'center'
    },
    textTokenDetail: {
      color: theme.colors.white,
      fontSize: 12
    },
    smallMarginTop: {
      marginTop: 8
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    }
  })

const mapDispatchToProps = (dispatch, _ownProps) => ({
  plasmaTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(plasmaActions.transfer(blockchainWallet, toAddress, token, fee))
})

export default connect(
  null,
  mapDispatchToProps
)(withNavigation(withTheme(DepositApprove)))
