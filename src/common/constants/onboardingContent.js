export const WELCOME_BOTTOM_SHEET = {
  title: 'Welcome',
  key: 'WELCOME_BOTTOM_SHEET',
  paragraphs: [
    'Now you can start try interact with Plasma network powered by OmiseGO. We’d like to help you get started, Let we take you a tour ;)'
  ],
  buttonTextConfirm: 'TAKE A TOUR',
  buttonTextDismiss: 'NO, THANKS',
  isModal: true,
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) =>
    enabledOnboarding === null && currentPage === 'childchain-balance'
}

export const PLASMA_WALLET_BOTTOM_SHEET = {
  title: 'Your wallet have 2 pockets !',
  key: 'PLASMA_WALLET_BOTTOM_SHEET',
  imageCenterName: 'TourPlasmaWallet',
  imageBottomName: 'TourSwipe',
  textBottomBig: 'NOW, SWIPE LEFT',
  textBottomSmall: 'to Ethereum pocket',
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'childchain-balance' &&
      !viewedPopups.includes('PLASMA_WALLET_BOTTOM_SHEET')
    )
  }
}

export const ETHEREUM_WALLET_BOTTOM_SHEET = {
  title: "Let's try get some fund !",
  key: 'ETHEREUM_WALLET_BOTTOM_SHEET',
  imageCenterName: 'TourEthereumWallet',
  imageBottomName: 'TourSwipe',
  textBottomBig: 'SWIPE LEFT AGAIN',
  textBottomSmall: 'to try topup wallet',
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      !viewedPopups.includes('ETHEREUM_WALLET_BOTTOM_SHEET')
    )
  }
}

export const TRY_DEPOSIT_OMG_POPUP = {
  title: 'Your plasma funds',
  key: 'TRY_DEPOSIT_OMG_POPUP',
  paragraphs: ['To transact, deposit funds from Ethereum to the OMG network.'],
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
      currentPage === 'address-qr' &&
      nextPopup === 'TRY_DEPOSIT_OMG_POPUP'
    )
  }
}

export const ROOTCHAIN_POPUP = {
  title: 'The root chain is our main Ethereum blockchain.',
  key: 'ROOTCHAIN_POPUP',
  paragraphs: [
    'In this section you can see the value of all your stored coins on the blockchain for this wallet.'
  ],
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'up',
  anchoredTo: 'EthereumBlockchainLabel',
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      viewedPopups.includes('ADDRESS_QR_BOTTOM_SHEET') &&
      !viewedPopups.includes('ROOTCHAIN_POPUP')
    )
  }
}

export const CHILDCHAIN_POPUP = {
  title: 'The Child Chain is Plasma – The OmiseGO Network.',
  key: 'CHILDCHAIN_POPUP',
  paragraphs: [
    'In this section you can see the funds deposited for transactions on the OmiseGO Network.'
  ],
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'up',
  anchoredTo: 'PlasmaBlockchainLabel',
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'childchain-balance' &&
      viewedPopups.includes('ADDRESS_QR_BOTTOM_SHEET') &&
      !viewedPopups.includes('CHILDCHAIN_POPUP')
    )
  }
}

export const DEPOSIT_POPUP = {
  title: 'Deposit',
  key: 'DEPOSIT_POPUP',
  paragraphs: [
    "You'll need funds on the child chain to transact on the OmiseGO Network.",
    'Transacting on our network is faster, more affordable, and highly secure.',
    'Transfer funds from the Root Chain to the Child Chain. All transaction fees on the blockchain are paid in ETH.'
  ],
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'down',
  anchoredTo: 'DepositButton',
  shouldDisplay: (
    enabledOnboarding,
    currentPage,
    viewedPopups,
    { rootchainAssets }
  ) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      viewedPopups.includes('ROOTCHAIN_POPUP') &&
      !viewedPopups.includes('DEPOSIT_POPUP') &&
      rootchainAssets &&
      rootchainAssets.length > 0
    )
  }
}

export const TRANSFER_POPUP = {
  title: 'Transfer',
  key: 'TRANSFER_POPUP',
  paragraphs: [
    'Transactions made with the OMG Network cost less than transactions on Ethereum.'
  ],
  buttonText: 'OKAY',
  isPopup: true,
  arrowDirection: 'down',
  anchoredTo: 'TransferButton',
  shouldDisplay: (
    enabledOnboarding,
    currentPage,
    viewedPopups,
    { childchainAssets }
  ) => {
    return (
      enabledOnboarding &&
      currentPage === 'childchain-balance' &&
      viewedPopups.includes('CHILDCHAIN_POPUP') &&
      !viewedPopups.includes('TRANSFER_POPUP') &&
      childchainAssets &&
      childchainAssets.length > 0
    )
  }
}

export const EXIT_POPUP = {
  title: 'Withdraw funds from the OMG Network.',
  key: 'EXIT_POPUP',
  paragraphs: [
    'Move your funds from the OMG Network to Ethereum. All withdrawal fees are paid in ETH.'
  ],
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'down',
  anchoredTo: 'ExitButton',
  imageBottomName: 'TourExit',
  shouldDisplay: (
    enabledOnboarding,
    currentPage,
    viewedPopups,
    { childchainAssets }
  ) => {
    return (
      currentPage === 'childchain-balance' &&
      viewedPopups.includes('TRANSFER_POPUP') &&
      !viewedPopups.includes('EXIT_POPUP') &&
      childchainAssets &&
      childchainAssets.length > 0
    )
  }
}

export const TRANSACTION_HISTORY_MENU_POPUP = {
  title: 'Keep track of your activities',
  key: 'TRANSACTION_HISTORY_MENU_POPUP',
  paragraphs: [
    `"History" shows the transaction history of your wallets. You can also view every deposit and withdrawal you've made on the OMG Network.`
  ],
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'up',
  anchoredTo: 'TransactionHistoryMenu',
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'transaction-history' &&
      !viewedPopups.includes('TRANSACTION_HISTORY_MENU_POPUP')
    )
  }
}
