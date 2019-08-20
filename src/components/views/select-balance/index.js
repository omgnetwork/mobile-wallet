import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useLoading } from 'common/hooks'
import { OMGBox, OMGButton, OMGEmpty, OMGTokenSelect } from 'components/widgets'

const SelectBalance = ({ primaryWallet, theme, loadingStatus, navigation }) => {
  const assets = navigation.getParam('assets', primaryWallet.assets)
  const currentToken = navigation.getParam('currentToken')
  const [loading] = useLoading(loadingStatus)
  const [selectedToken, setSelectedToken] = useState(currentToken || assets[0])

  return (
    <View style={styles.container(theme)}>
      <FlatList
        data={assets || []}
        keyExtractor={item => item.contractAddress}
        ListEmptyComponent={<OMGEmpty text='Empty assets' loading={loading} />}
        contentContainerStyle={
          assets && assets.length
            ? {}
            : { flexGrow: 1, justifyContent: 'center' }
        }
        renderItem={({ item }) => (
          <OMGTokenSelect
            key={item.contractAddress}
            style={{ marginTop: 8 }}
            token={item}
            onPress={() => {
              setSelectedToken(item)
            }}
            selected={item.contractAddress === selectedToken.contractAddress}
          />
        )}
      />
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.button}
          onPress={() => {
            navigation.navigate('TransactionForm', {
              selectedToken
            })
          }}>
          Apply
        </OMGButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    padding: 16
  }),
  formContainer: {
    flex: 1
  },
  fromContainer: {
    flexDirection: 'column'
  },
  toContainer: {
    marginTop: 8,
    flexDirection: 'column'
  },
  amountContainer: {
    marginTop: 8,
    flexDirection: 'column'
  },
  feeContainer: {
    marginTop: 8,
    flexDirection: 'column'
  },
  tokenInput: {
    marginTop: 16
  },
  walletAddress: {
    marginTop: 16
  },
  addressInput: {
    marginTop: 16
  },
  amountInput: {
    marginTop: 16
  },
  feeInput: {
    marginTop: 16
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  }
})

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(SelectBalance)))
