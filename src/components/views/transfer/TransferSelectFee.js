import React, { useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import {
  OMGButton,
  OMGEmpty,
  OMGFeeSelect,
  OMGFontIcon,
  OMGText
} from 'components/widgets'
import { getParamsForTransferSelectFeeFromTransferForm } from './transferNavigation'

const TransferSelectFee = ({ theme, loading, navigation }) => {
  const {
    fees,
    currentToken,
    currentFee
  } = getParamsForTransferSelectFeeFromTransferForm(navigation)
  const [selectedFee, setSelectedFee] = useState(currentFee || fees[0])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View style={styles.header}>
        <OMGFontIcon
          name='chevron-left'
          size={18}
          color={theme.colors.white}
          style={styles.headerIcon}
          onPress={() =>
            navigation.navigate('TransferForm', {
              lastAmount: currentToken.balance
            })
          }
        />
        <OMGText style={styles.headerTitle(theme)}>Transaction Fee</OMGText>
      </View>
      <View style={styles.gasRecommendContainer(theme)}>
        <OMGText style={styles.gasRecommendText(theme)}>
          {`Recommended Gas Prices estimated\nby ethgasstation.info`}
        </OMGText>
      </View>
      <View style={styles.listContainer(theme)}>
        <FlatList
          data={fees || []}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps='always'
          ListEmptyComponent={
            <OMGEmpty text='Empty fees' loading={loading.show} />
          }
          contentContainerStyle={
            fees && fees.length ? {} : { flexGrow: 1, justifyContent: 'center' }
          }
          renderItem={({ item }) => (
            <OMGFeeSelect
              key={item.id}
              style={{ marginTop: 8 }}
              fee={item}
              onPress={() => {
                setSelectedFee(item)
              }}
              selected={item.id === selectedFee.id}
            />
          )}
        />
        <View style={styles.buttonContainer}>
          <OMGButton
            onPress={() => {
              navigation.navigate('TransferForm', {
                selectedFee,
                lastAmount: currentToken.balance
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
    backgroundColor: theme.colors.new_black7
  })
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
)(withNavigation(withTheme(TransferSelectFee)))
