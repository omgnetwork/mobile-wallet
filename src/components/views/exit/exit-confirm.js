import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { Formatter } from 'common/utils'
import { OMGText, OMGIcon, OMGButton, OMGExitWarning } from 'components/widgets'

const ExitConfirm = ({ theme, navigation }) => {
  const token = navigation.getParam('token')
  const tokenPrice = formatTokenPrice(token.balance, token.price)
  const [loadingVisible, setLoadingVisible] = useState(false)
  const [confirmBtnDisable, setConfirmBtnDisable] = useState(false)

  const exit = () => {
    navigation.navigate('ExitPending', {
      token,
      pendingTx: { hash: '1234' }
    })
  }

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View style={styles.contentContainer}>
        <View style={styles.subHeaderContainer}>
          <OMGIcon
            name='chevron-left'
            size={14}
            color={theme.colors.gray3}
            onPress={() =>
              navigation.navigate('ExitForm', {
                lastAmount: token.balance
              })
            }
          />
          <OMGText style={styles.edit}>Edit</OMGText>
        </View>
        <View style={styles.amountContainer(theme)}>
          <OMGText style={styles.tokenBalance(theme)}>
            {formatTokenBalance(token.balance)}
          </OMGText>
          <View style={styles.balanceContainer}>
            <OMGText style={styles.tokenSymbol(theme)}>
              {token.tokenSymbol}
            </OMGText>
            <OMGText style={styles.tokenWorth(theme)}>{tokenPrice} USD</OMGText>
          </View>
        </View>
        <OMGExitWarning />
      </View>
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.button}
          loading={loadingVisible}
          disabled={loadingVisible || confirmBtnDisable}
          onPress={exit}>
          Exit from plasma chain
        </OMGButton>
      </View>
    </SafeAreaView>
  )
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

const formatTokenBalance = amount => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: 3,
    ellipsize: false
  })
}

const formatTotalPrice = (tokenPrice, feePrice) => {
  const totalPrice = parseFloat(tokenPrice) + parseFloat(feePrice)
  return Formatter.format(totalPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white
  }),
  contentContainer: {
    flex: 1
  },
  subHeaderContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountContainer: theme => ({
    marginTop: 16,
    padding: 20,
    backgroundColor: theme.colors.gray4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  subHeaderTitle: {
    fontSize: 14
  },
  edit: {
    marginLeft: 8
  },
  tokenBalance: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenSymbol: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenWorth: theme => ({
    color: theme.colors.black2
  }),
  subtitle: theme => ({
    marginTop: 8,
    color: theme.colors.gray3
  })
})

export default withNavigation(withTheme(ExitConfirm))
