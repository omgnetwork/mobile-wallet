export const NOTIFY_UTXO_IS_READY_TO_EXIT = (tokenValue, tokenSymbol) => ({
  title: `${tokenValue} ${tokenSymbol} is ready to exit`,
  message: `The utxo will be processed within 24 hours.`
})

export const NOTIFY_TRANSACTION_SENT_ETH_NETWORK = (
  walletName,
  tokenValue,
  tokenSymbol
) => ({
  title: `${walletName} sent on the Ethereum`,
  message: `${tokenValue} ${tokenSymbol}`
})

export const NOTIFY_TRANSACTION_SENT_OMG_NETWORK = (
  walletName,
  tokenValue,
  tokenSymbol
) => ({
  title: `${walletName} sent on the OMG Network`,
  message: `${tokenValue} ${tokenSymbol}`
})

export const NOTIFY_TRANSACTION_DEPOSITED = (
  walletName,
  tokenValue,
  tokenSymbol
) => ({
  title: `${walletName} deposited`,
  message: `${tokenValue} ${tokenSymbol}`
})

export const NOTIFY_TRANSACTION_START_STANDARD_EXITED = (
  walletName,
  tokenValue,
  tokenSymbol
) => ({
  title: `${walletName} has started a withdrawal`,
  message: `${tokenValue} ${tokenSymbol}`
})

export const NOTIFY_TRANSACTION_PROCESSED_EXIT = (
  walletName,
  tokenValue,
  tokenSymbol
) => ({
  title: `${walletName} has processed a withdrawal`,
  message: `${tokenValue} ${tokenSymbol}`
})

export const NOTIFY_TRANSACTION_READY_TO_PROCESS_EXITED = (
  tokenValue,
  tokenSymbol
) => ({
  title: `Ready to withdraw from the OMG Network`,
  message: `${tokenValue} ${tokenSymbol}`
})
