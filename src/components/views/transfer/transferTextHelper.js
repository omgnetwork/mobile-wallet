export const getBlockchainTextActionLabel = (screen, isDeposit) => {
  switch (screen) {
    case 'TransferPending':
      return isDeposit ? 'Deposited to' : 'Sent on'
    default:
      return isDeposit ? 'Depositing to' : 'Sending on'
  }
}
