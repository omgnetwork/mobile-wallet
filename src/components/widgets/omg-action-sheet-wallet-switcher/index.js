import React, { Fragment } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { OMGActionSheetContainer } from 'components/widgets'
import { BlockchainNetworkType } from 'common/constants'
import WalletSwitcherItem from './WalletSwitcherItem'
import { withTheme } from 'react-native-paper'

const OMGActionSheetWalletSwitcher = ({
  theme,
  wallets,
  primaryWalletAddress,
  isVisible
}) => {
  const styles = createStyles(theme)
  const WalletSwitcherItems = wallets.map((wallet, index) => (
    <Fragment key={index}>
      <WalletSwitcherItem
        key={'eth' + index}
        wallet={wallet}
        network={BlockchainNetworkType.TYPE_ETHEREUM_NETWORK}
        selected={primaryWalletAddress === wallet.address}
        style={styles.marginItem}
      />
      <WalletSwitcherItem
        key={'omg' + index}
        wallet={wallet}
        network={BlockchainNetworkType.TYPE_OMISEGO_NETWORK}
        selected={primaryWalletAddress === wallet.address}
        style={styles.marginItem}
      />
    </Fragment>
  ))
  return (
    <OMGActionSheetContainer isVisible={isVisible}>
      <View style={styles.container}>{WalletSwitcherItems}</View>
    </OMGActionSheetContainer>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      paddingTop: 28,
      paddingBottom: 16,
      paddingHorizontal: 24,
      width: Dimensions.get('window').width,
      flexDirection: 'column'
    },
    marginItem: {
      marginTop: 16
    }
  })

export default withTheme(OMGActionSheetWalletSwitcher)
