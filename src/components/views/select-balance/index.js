import React, { useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useLoading } from 'common/hooks'
import {
  OMGButton,
  OMGEmpty,
  OMGTokenSelect,
  OMGIcon,
  OMGText
} from 'components/widgets'

const SelectBalance = ({ primaryWallet, theme, loadingStatus, navigation }) => {
  const assets = navigation.getParam('assets', primaryWallet.assets)
  const currentToken = navigation.getParam('currentToken')
  const [loading] = useLoading(loadingStatus)
  const [selectedToken, setSelectedToken] = useState(currentToken || assets[0])

  return (
    <View style={styles.container(theme)}>
      <View style={styles.header}>
        <OMGIcon
          name='chevron-left'
          size={18}
          color={theme.colors.gray3}
          style={styles.headerIcon}
          onPress={() =>
            navigation.navigate('TransactionForm', {
              selectedToken: selectedToken
            })
          }
        />
        <OMGText style={styles.headerTitle(theme)}>Select Balance</OMGText>
      </View>
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
  header: {
    flexDirection: 'row',
    marginBottom: 32
  },
  headerIcon: {},
  headerTitle: theme => ({
    fontSize: 18,
    color: theme.colors.gray3,
    marginLeft: 16,
    textTransform: 'uppercase'
  }),
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
