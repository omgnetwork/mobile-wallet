import React, { useState, Fragment, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { plasmaActions, walletActions } from 'common/actions'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { Formatter, Datetime } from 'common/utils'
import {
  OMGItemToken,
  OMGAssetHeader,
  OMGAssetList,
  OMGAssetFooter
} from 'components/widgets'

const ChildchainBalance = ({
  dispatchLoadAssets,
  dispatchInvalidatePendingTxs,
  dispatchSetShouldRefreshChildchain,
  dispatchSubscribeChildchainTransaction,
  pendingTxs,
  wallet,
  navigation
}) => {
  const currency = 'USD'
  const [totalBalance, setTotalBalance] = useState(0.0)
  const disabledChildchainAction =
    !wallet.childchainAssets || wallet.childchainAssets.length === 0

  useEffect(() => {
    if (wallet.shouldRefreshChildchain && wallet.rootchainAssets) {
      dispatchLoadAssets(wallet)
      // dispatchInvalidatePendingTxs(wallet, pendingTxs)
      dispatchSetShouldRefreshChildchain(wallet.address, false)
    }
  }, [
    dispatchInvalidatePendingTxs,
    dispatchLoadAssets,
    dispatchSetShouldRefreshChildchain,
    pendingTxs,
    wallet
  ])

  useEffect(() => {
    if (wallet.childchainAssets) {
      const totalPrices = wallet.childchainAssets.reduce((acc, asset) => {
        const parsedAmount = parseFloat(asset.balance)
        const tokenPrice = parsedAmount * asset.price
        return tokenPrice + acc
      }, 0)

      setTotalBalance(totalPrices)
    }
  }, [wallet.childchainAssets])

  return (
    <Fragment>
      <OMGAssetHeader
        amount={formatTotalBalance(totalBalance)}
        currency={currency}
        rootchain={false}
        blockchain={'Plasma'}
        network={Config.OMISEGO_NETWORK}
      />
      <OMGAssetList
        data={wallet.childchainAssets || []}
        keyExtractor={item => item.contractAddress}
        updatedAt={Datetime.format(wallet.updatedAt, 'LTS')}
        style={styles.list}
        renderItem={({ item }) => (
          <OMGItemToken key={item.contractAddress} token={item} />
        )}
      />
      <OMGAssetFooter
        disabled={disabledChildchainAction}
        onPressDeposit={() => navigation.navigate('TransferDeposit')}
        onPressExit={() => navigation.navigate('TransferExit')}
      />
    </Fragment>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  }
})

const formatTotalBalance = balance => {
  return Formatter.format(balance, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const mapStateToProps = (state, ownProps) => ({
  pendingTxs: state.transaction.pendingTxs,
  loading: state.loading,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchLoadAssets: wallet =>
    dispatch(plasmaActions.fetchAssets(wallet.rootchainAssets, wallet.address)),
  dispatchSetShouldRefreshChildchain: (address, shouldRefreshChildchain) =>
    walletActions.refreshChildchain(dispatch, address, shouldRefreshChildchain)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ChildchainBalance)))
