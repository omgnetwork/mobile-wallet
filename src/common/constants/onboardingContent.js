export const WELCOME_BOTTOM_SHEET = {
  title: 'Welcome!',
  key: 'WELCOME_BOTTOM_SHEET',
  paragraphs: ['Let’s start with a quick tour.'],
  buttonTextConfirm: 'TAKE A TOUR',
  buttonTextDismiss: 'SKIP',
  isModal: true,
  shouldDisplay: ({ enabledOnboarding, currentPage }) =>
    enabledOnboarding === null && currentPage === 'childchain-balance'
}

export const CHILDCHAIN_POPUP = {
  title: 'This is your Plasma Wallet',
  key: 'CHILDCHAIN_POPUP',
  paragraphs: ['It’s connected to the OMG Network.'],
  buttonText: 'Next',
  isPopup: true,
  arrowDirection: 'up',
  imageBottomName: 'TourPlasmaWallet',
  onPress: (navigation, setNextPopup) => {
    setNextPopup('TRY_DEPOSIT_OMG_POPUP')
  },
  anchoredTo: 'PlasmaBlockchainLabel',
  shouldDisplay: ({ enabledOnboarding, currentPage, nextPopup }) => {
    return (
      enabledOnboarding &&
      currentPage === 'childchain-balance' &&
      nextPopup === 'CHILDCHAIN_POPUP'
    )
  }
}

export const ROOTCHAIN_POPUP = {
  title: 'This is your Ethereum Wallet',
  key: 'ROOTCHAIN_POPUP',
  paragraphs: ['It’s connected to the Ethereum Network.'],
  buttonText: 'Next',
  isPopup: true,
  arrowDirection: 'up',
  anchoredTo: 'EthereumBlockchainLabel',
  onPress: (navigation, setNextPopup) => {
    setNextPopup('DEPOSIT_POPUP')
  },
  shouldDisplay: ({
    enabledOnboarding,
    currentPage,
    nextPopup,
    rootchainAssets
  }) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      nextPopup === 'ROOTCHAIN_POPUP' &&
      rootchainAssets.length > 0
    )
  }
}

export const ROOTCHAIN_POPUP_EMPTY = {
  title: 'This is your Ethereum Wallet',
  paragraphs: ['It’s connected to the Ethereum Network.'],
  key: 'ROOTCHAIN_POPUP_EMPTY',
  buttonText: 'Next',
  isPopup: true,
  arrowDirection: 'up',
  onPress: (navigation, setNextPopup) => {
    setNextPopup('TRY_DEPOSIT_ETH_POPUP')
  },
  anchoredTo: 'EthereumBlockchainLabel',
  shouldDisplay: ({
    enabledOnboarding,
    currentPage,
    nextPopup,
    rootchainAssets
  }) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      nextPopup === 'ROOTCHAIN_POPUP' &&
      rootchainAssets.length === 0
    )
  }
}

export const TRY_DEPOSIT_OMG_POPUP = {
  title: 'Your plasma funds',
  key: 'TRY_DEPOSIT_OMG_POPUP',
  paragraphs: [
    'To transact on OMG Network, transfer funds from the Ethereum to OMG network.'
  ],
  buttonText: 'Next',
  isPopup: true,
  imageBottomName: 'TourMoveFund',
  arrowDirection: 'up',
  onPress: (navigation, setNextPopup) => {
    navigation.navigate('Balance', { page: 2 })
    setNextPopup('ROOTCHAIN_POPUP')
  },
  anchoredTo: 'AssetsLabel',
  shouldDisplay: ({ enabledOnboarding, currentPage, nextPopup }) => {
    return (
      enabledOnboarding &&
      currentPage === 'childchain-balance' &&
      nextPopup === 'TRY_DEPOSIT_OMG_POPUP'
    )
  }
}

export const TRY_DEPOSIT_ETH_POPUP = {
  title: 'Your ethereum funds',
  key: 'TRY_DEPOSIT_ETH_POPUP',
  paragraphs: [
    'Hmm, your Ethereum Wallet is empty. Deposit funds to get started!'
  ],
  buttonText: 'Next',
  isPopup: true,
  arrowDirection: 'up',
  onPress: (navigation, setNextPopup) => {
    setNextPopup('SHARE_QR')
    navigation.navigate('Balance', { page: 3 })
  },
  anchoredTo: 'AssetsLabel',
  shouldDisplay: ({ enabledOnboarding, currentPage, nextPopup }) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      nextPopup === 'TRY_DEPOSIT_ETH_POPUP'
    )
  }
}

export const SHARE_QR = {
  title: 'Your wallet address',
  key: 'SHARE_QR',
  paragraphs: ['Share your wallet address or QR code to receive funds'],
  buttonText: 'Got It',
  isPopup: true,
  arrowDirection: 'down',
  anchoredTo: 'QRCode',
  shouldDisplay: ({ enabledOnboarding, currentPage, nextPopup }) => {
    return (
      enabledOnboarding &&
      currentPage === 'address-qr' &&
      nextPopup === 'SHARE_QR'
    )
  }
}

export const DEPOSIT_POPUP = {
  title: 'Deposit',
  key: 'DEPOSIT_POPUP',
  paragraphs: ['You can deposit fund to OMG network right here.'],
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'down',
  imageBottomName: 'TourMoveFund',
  anchoredTo: 'DepositButton',
  onPress: (navigation, setNextPopup) => {
    setNextPopup('TRANSFER_POPUP')
  },
  shouldDisplay: ({ enabledOnboarding, currentPage, nextPopup }) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      nextPopup === 'DEPOSIT_POPUP'
    )
  }
}

export const TRANSFER_POPUP = {
  title: 'Transfer funds on the OMG Network!',
  key: 'TRANSFER_POPUP',
  paragraphs: [
    'Transactions made with OMG Network cost less than transactions on Ethereum.'
  ],
  buttonText: 'Got It',
  isPopup: true,
  arrowDirection: 'down',
  anchoredTo: 'TransferButton',
  onPress: (navigation, setNextPopup) => {
    navigation.navigate('Balance', { page: 1 })
    setNextPopup('EXIT_POPUP')
  },
  shouldDisplay: ({ enabledOnboarding, currentPage, nextPopup }) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      nextPopup === 'TRANSFER_POPUP'
    )
  }
}

export const EXIT_POPUP = {
  title: 'Exit funds whenever you want.',
  key: 'EXIT_POPUP',
  paragraphs: [
    'Move your funds from the OMG Network to Ethereum. All exit fees are paid in ETH.'
  ],
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'down',
  anchoredTo: 'ExitButton',
  onPress: (navigation, setNextPopup) => {
    setNextPopup(null)
  },
  shouldDisplay: ({ enabledOnboarding, currentPage, nextPopup }) => {
    return (
      enabledOnboarding &&
      currentPage === 'childchain-balance' &&
      nextPopup === 'EXIT_POPUP'
    )
  }
}

export const TRANSACTION_HISTORY_MENU_POPUP = {
  title: 'Keep track of your activities',
  key: 'TRANSACTION_HISTORY_MENU_POPUP',
  paragraphs: [
    `"History" lets you view past transactions on all your wallets. You can also view every deposit and exit you've made on the child chain.`
  ],
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'up',
  anchoredTo: 'TransactionHistoryMenu',
  onPress: (navigation, setNextPopup) => {
    setNextPopup(null)
    navigation.navigate('Balance', { page: 2 })
  },
  shouldDisplay: ({ enabledOnboarding, nextPopup }) => {
    return enabledOnboarding && nextPopup === 'TRANSACTION_HISTORY_MENU_POPUP'
  }
}
