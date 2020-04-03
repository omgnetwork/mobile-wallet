import React, { useCallback, useState, useEffect, useRef } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Plasma, BlockchainFormatter, Utxos } from 'common/blockchain'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGText, OMGUtxoSelect, OMGButton } from 'components/widgets'

const ExitSelectUtxo = ({ theme, primaryWallet, navigation }) => {
  const token = navigation.getParam('token')
  const [loading, setLoading] = useState(false)
  const [utxos, setUtxos] = useState([])
  const [disabled, setDisabled] = useState(true)
  const selectedUtxos = useRef([])

  const fetchUtxos = useCallback(async () => {
    setLoading(true)
    const result = await Utxos.get(primaryWallet.address, {
      currency: token.contractAddress
    })
    setUtxos(result)
    setLoading(false)
  }, [primaryWallet.address, token.contractAddress])

  useEffect(() => {
    fetchUtxos()
  }, [fetchUtxos])

  const onAdded = useCallback(utxo => {
    selectedUtxos.current.push(utxo)
    setDisabled(false)
  }, [])

  const onRemoved = useCallback(utxo => {
    selectedUtxos.current = selectedUtxos.current.filter(
      u => u.utxo_pos !== utxo.utxo_pos
    )
    if (selectedUtxos.current.length === 0) {
      setDisabled(true)
    }
  }, [])

  const confirm = useCallback(() => {
    navigation.navigate('ExitSelectFee', {
      utxos: selectedUtxos.current,
      token
    })
  }, [navigation, token])

  return (
    <View style={styles.container(theme)}>
      <OMGText style={styles.title(theme)} weight='regular'>
        Select UTXOs
      </OMGText>
      <OMGText style={styles.description(theme)}>
        You can select up to 4 UTXOs to Exit at once
      </OMGText>
      <FlatList
        data={utxos}
        keyExtractor={item => item.utxo_pos}
        ItemSeparatorComponent={() => <Divider theme={theme} />}
        ListEmptyComponent={<OMGEmpty text='Empty assets' loading={loading} />}
        contentContainerStyle={
          utxos.length ? styles.listContainer : styles.emptyContainer
        }
        renderItem={({ item }) => (
          <OMGUtxoSelect
            key={item.utxo_pos}
            token={token}
            utxo={item}
            onAdded={onAdded}
            onRemoved={onRemoved}
          />
        )}
      />
      <View style={[styles.buttonContainer]}>
        <OMGButton disabled={disabled} onPress={confirm}>
          Next
        </OMGButton>
      </View>
    </View>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    paddingTop: 16,
    backgroundColor: theme.colors.black5,
    paddingHorizontal: 16
  }),
  title: theme => ({
    fontSize: 16,
    textTransform: 'uppercase',
    color: theme.colors.gray2
  }),
  description: theme => ({
    fontSize: 12,
    marginTop: 8,
    color: theme.colors.gray2,
    letterSpacing: -0.48
  }),
  listContainer: {
    marginTop: 8
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  divider: theme => ({
    backgroundColor: theme.colors.black2,
    height: 1
  }),
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: 16
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(ExitSelectUtxo)))
