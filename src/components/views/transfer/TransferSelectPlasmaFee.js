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
import { getParamsForTransferSelectTokenFeeFromTransferForm } from './transferNavigation'

const TransferSelectPlasmaFee = ({ theme, loading, navigation, fees }) => {
  const {
    currentFeeToken,
    tokens
  } = getParamsForTransferSelectTokenFeeFromTransferForm(navigation)
  const [displayFees, setDisplayFees] = useState(fees)
  const [selectedFeeToken, setSelectedFeeToken] = useState(currentFeeToken)

  useEffect(() => {
    if (fees && fees.length) {
      setDisplayFees(fees)
      setSelectedFeeToken(fees[0])
    }
  }, [fees, tokens])

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
                setSelectedFeeToken(item)
              }}
              selected={
                selectedFeeToken &&
                item.contractAddress === selectedFeeToken.contractAddress
              }
            />
          )}
        />
        <View style={styles.buttonContainer}>
          <OMGButton
            onPress={() => {
              navigation.navigate('TransferForm', {
                selectedFeeToken
              })
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
    backgroundColor: theme.colors.gray4
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
    marginVertical: 16,
    paddingHorizontal: 16
  },
  gasRecommendContainer: theme => ({
    marginTop: 16,
    padding: 12,
    flexDirection: 'column',
    backgroundColor: theme.colors.new_gray3,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  gasRecommendText: theme => ({
    color: theme.colors.white,
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: -0.48,
    lineHeight: 18
  }),
  listContainer: theme => ({
    padding: 16,
    flex: 1,
    backgroundColor: theme.colors.gray4
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
