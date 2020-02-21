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
  OMGText
} from 'components/widgets'
import {
  getParamsForTransferSelectPlasmaFeeFromTransferForm,
  paramsForTransferSelectPlasmaFeeToTransferForm
} from './transferNavigation'

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
        <OMGFontIcon
          name='chevron-left'
          size={18}
          color={theme.colors.white}
          style={styles.headerIcon}
          onPress={() => navigation.navigate('TransferForm', {})}
        />
        <OMGText style={styles.headerTitle(theme)} weight='regular'>
          SELECT TOKEN TO PAY FEE
        </OMGText>
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
              style={{ marginTop: 8 }}
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 16,
    marginTop: 8
  },
  headerIcon: {
    padding: 8,
    marginLeft: -8
  },
  headerTitle: theme => ({
    fontSize: 18,
    color: theme.colors.white,
    marginLeft: 8,
    paddingVertical: 16,
    textTransform: 'uppercase'
  }),
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16
  },
  listContainer: theme => ({
    padding: 16,
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
