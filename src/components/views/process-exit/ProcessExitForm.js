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
  const [maxQueue, setMaxQueue] = useState(null)
  const [error, setError] = useState(null)
  const [buttonEnable, setButtonEnable] = useState(false)
  const [exitInputTintColor, setExitInputTintColor] = useState(
    theme.colors.gray4
  )

  const onChangeExitInput = useCallback(
    text => {
      if (text < queue) {
        setError('Should not be less than current queue')
        setExitInputTintColor(theme.colors.red)
        setButtonEnable(false)
      } else if (text > maxQueue) {
      } else if (text > queue) {
        setError('Should be ≥ current exit queue and ≤ queue length')
        setExitInputTintColor(theme.colors.red)
        setButtonEnable(false)
      } else {
        setError(null)
        setButtonEnable(true)
        setExitInputTintColor(theme.colors.primary)
      }
    },
    [maxQueue, queue, theme.colors.primary, theme.colors.red]
  )

  const handleOnFocus = useCallback(() => {
    if (!error) setExitInputTintColor(theme.colors.primary)
  }, [error, theme.colors.primary])

  const handleOnBlur = useCallback(() => {
    if (!error) setExitInputTintColor(theme.colors.gray4)
  }, [error, theme.colors.gray4])

  const handleOnSubmit = useCallback(() => {
    const exits = processExitInput.current
  }, [])

  useEffect(() => {
    async function getExitQueue() {
      const exitQueue = await Plasma.getExitQueue(transaction.contractAddress)
      let position = exitQueue.queue.findIndex(
        q => q.exitId === transaction.exitId
      )
      setQueue(position + 1)
      setMaxQueue(exitQueue.queue.length)
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
        <OMGText style={[styles.title(theme)]}>UTXO DETAILS</OMGText>
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
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          exitQueue={queue}
          maxQueue={maxQueue}
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
