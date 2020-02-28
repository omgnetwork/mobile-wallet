import React, { useRef, useCallback, useState, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import {
  OMGText,
  OMGBlockchainLabel,
  OMGUtxoDetail,
  OMGTokenID,
  OMGProcessExitInput,
  OMGKeyboardShift,
  OMGButton
} from 'components/widgets'
import { Plasma } from 'common/blockchain'
import { StyleSheet, View } from 'react-native'

const ProcessExitForm = ({ theme, navigation }) => {
  const transaction = navigation.getParam('transaction')
  const processExitInput = useRef(null)
  const [queue, setQueue] = useState(null)
  const [error, setError] = useState(null)
  const [buttonEnable, setButtonEnable] = useState(false)
  const [exitInputTintColor, setExitInputTintColor] = useState(
    theme.colors.gray4
  )

  const onChangeExitInput = useCallback(
    text => {
      if (text <= 0 || text > queue) {
        setError('Invalid exits')
        setExitInputTintColor(theme.colors.red)
        setButtonEnable(false)
      } else {
        setError(null)
        setButtonEnable(true)
        setExitInputTintColor(theme.colors.primary)
      }
    },
    [queue, theme.colors.primary, theme.colors.red]
  )

  const handleOnSubmit = useCallback(() => {
    const exits = processExitInput.current
  }, [])

  useEffect(() => {
    async function getExitQueue() {
      const exitQueue = await Plasma.getExitQueue(transaction.contractAddress)
      setQueue(exitQueue.queue.length)
      setButtonEnable(true)
    }

    getExitQueue()
  }, [transaction])

  return (
    <View style={styles.container(theme)}>
      <OMGBlockchainLabel
        actionText={'Sending on'}
        transferType={'Ethereum Rootchain'}
      />
      <OMGKeyboardShift
        extraHeight={70}
        contentContainerStyle={styles.contentContainer}
        androidEnabled={true}>
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          UTXO DETAILS
        </OMGText>
        <OMGUtxoDetail utxo={transaction} style={styles.marginSmall} />
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          TOKEN ID
        </OMGText>
        <OMGTokenID
          tokenContractAddress={transaction.contractAddress}
          style={styles.marginSmall}
        />
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          MAX EXIT TO PROCESS
        </OMGText>
        <OMGProcessExitInput
          inputRef={processExitInput}
          focusColor={exitInputTintColor}
          error={error}
          onChangeText={onChangeExitInput}
          onFocus={() => setExitInputTintColor(theme.colors.primary)}
          onBlur={() => setExitInputTintColor(theme.colors.gray4)}
          exitQueue={queue}
          style={styles.marginSmall}
        />
        <View style={styles.buttonContainer}>
          <OMGButton onPress={handleOnSubmit} disabled={!buttonEnable}>
            Next
          </OMGButton>
        </View>
      </OMGKeyboardShift>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
  }),
  marginSmall: {
    marginTop: 10
  },
  marginMedium: {
    marginTop: 20
  },
  title: theme => ({
    color: theme.colors.white,
    fontSize: 12
  }),
  contentContainer: {
    padding: 16,
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})

export default withNavigation(withTheme(ProcessExitForm))
