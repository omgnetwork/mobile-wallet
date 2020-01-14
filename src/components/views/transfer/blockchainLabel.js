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
    : 'Sending on'
}

const getDoneText = transferType => {
  return transferType === TransferHelper.TYPE_DEPOSIT
    ? 'Deposited to'
    : 'Sent on'
}
