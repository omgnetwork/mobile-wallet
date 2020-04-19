import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import {
  OMGButton,
  OMGEmpty,
  OMGTokenFee,
  OMGFontIcon,
  OMGText,
  OMGHeader
} from 'components/widgets'
import {
  getParamsForTransferSelectPlasmaFeeFromTransferForm,
  paramsForTransferSelectPlasmaFeeToTransferForm
} from './transferNavigation'
import { Styles } from 'common/utils'

const TransferSelectPlasmaFee = ({ theme, loading, navigation, fees }) => {
  const {
    selectedPlasmaFee,
    tokens
  } = getParamsForTransferSelectPlasmaFeeFromTransferForm(navigation)
  const [displayFees, setDisplayFees] = useState(fees)
  const [plasmaFee, setPlasmaFee] = useState(selectedPlasmaFee)

  useEffect(() => {
    if (fees && fees.length) {
      setDisplayFees(fees)
      setPlasmaFee(selectedPlasmaFee || fees[0])
    }
  }, [selectedPlasmaFee, fees, tokens])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View style={styles.header}>
        <OMGHeader title='Select Token To Pay Fee' />
      </View>
      <View style={styles.listContainer(theme)}>
        <FlatList
          data={displayFees}
          keyExtractor={item => item.contractAddress}
          keyboardShouldPersistTaps='always'
          ListEmptyComponent={
            <OMGEmpty text='Empty fees' loading={loading.show} />
          }
          contentContainerStyle={
            displayFees.length ? {} : { flexGrow: 1, justifyContent: 'center' }
          }
          renderItem={({ item }) => (
            <OMGTokenFee
              key={item.contractAddress}
              token={item}
              onPress={() => {
                setPlasmaFee(item)
              }}
              selected={
                plasmaFee && item.contractAddress === plasmaFee.contractAddress
              }
            />
          )}
        />
        <View style={styles.buttonContainer}>
          <OMGButton
            onPress={() => {
              const params = paramsForTransferSelectPlasmaFeeToTransferForm({
                selectedPlasmaFee: plasmaFee
              })
              navigation.navigate('TransferForm', params)
            }}>
            Apply
          </OMGButton>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5
  }),
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: Styles.getResponsiveSize(16, { small: 8, medium: 12 })
  },
  listContainer: theme => ({
    paddingVertical: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: theme.colors.black5
  })
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  fees: state.fees.data
})

export default connect(mapStateToProps)(
  withNavigation(withTheme(TransferSelectPlasmaFee))
)
