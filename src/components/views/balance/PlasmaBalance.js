import React, { useState, Fragment, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { plasmaActions } from 'common/actions'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { Formatter } from 'common/utils'
import {
  OMGItemToken,
  OMGAssetHeader,
  OMGAssetList,
  OMGAssetFooter
} from 'components/widgets'

const PlasmaBalance = ({ dispatchDepositEth, navigation }) => {
  const currency = 'USD'
  const [callPlasma, setCallPlasma] = useState(true)

  useEffect(() => {
    // if (callPlasma) dispatchDepositEth()
    setCallPlasma(false)
  }, [callPlasma, dispatchDepositEth])

  return (
    <Fragment>
      <OMGAssetHeader
        amount={formatTotalBalance(0.0)}
        currency={currency}
        rootChain={false}
        blockchain={'Plasma'}
        network={Config.OMISEGO_NETWORK}
      />
      <OMGAssetList
        data={[]}
        keyExtractor={item => item.contractAddress}
        style={styles.list}
        renderItem={({ item }) => (
          <OMGItemToken
            key={item.contractAddress}
            symbol={item.tokenSymbol}
            balance={formatTokenBalance(item.balance)}
            price={formatTokenPrice(item.balance, item.price)}
          />
        )}
      />
      <OMGAssetFooter
        onPressDeposit={() => navigation.navigate('ChildChainDeposit')}
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

const formatTokenBalance = amount => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: 3,
    ellipsize: true
  })
}

const formatTokenPrice = (amount, price) => {
  const parsedAmount = parseFloat(amount)
  const tokenPrice = parsedAmount * price
  return Formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchDepositEth: () => dispatch(plasmaActions.depositEth())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(PlasmaBalance)))
