import * as TransferHelper from './transferHelper'

export const getBlockchainTextActionLabel = (screen, transferType) => {
  switch (screen) {
    case 'TransferPending':
      return getDoneText(transferType)
    default:
      return getOngoingText(transferType)
  }
}

const getOngoingText = transferType => {
  return transferType === TransferHelper.TYPE_DEPOSIT
    ? 'Depositing to'
    : 'Sending to'
}

const getDoneText = transferType => {
  return transferType === TransferHelper.TYPE_DEPOSIT
    ? 'Deposited with'
    : 'Sent with'
}
