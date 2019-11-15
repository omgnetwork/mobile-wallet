export const WELCOME_BOTTOM_SHEET = {
  title: 'Welcome',
  tourName: 'welcome',
  text:
    'Now you can start try interact with Plasma network powered by OmiseGO. We’d like to help you get started, Let we take you a tour ;)',
  buttonTextConfirm: 'TAKE A TOUR',
  buttonTextDismiss: 'NO, THANKS',
  isModal: true,
  shouldDisplay: enabledOnboarding => !enabledOnboarding
}

export const PLASMA_WALLET_BOTTOM_SHEET = {
  title: 'Your wallet have 2 pockets !',
  tourName: 'plasmaWallet',
  imageCenterName: 'TourPlasmaWallet',
  imageBottomName: 'TourSwipe',
  textBottomBig: 'NOW, SWIPE LEFT',
  textBottomSmall: 'to Ethereum pocket',
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'childchain-balance' &&
      !viewedPopups.includes('plasmaWallet')
    )
  }
}

export const ETHEREUM_WALLET_BOTTOM_SHEET = {
  title: "Let's try get some fund !",
  tourName: 'ethereumWallet',
  imageCenterName: 'TourEthereumWallet',
  imageBottomName: 'TourSwipe',
  textBottomBig: 'SWIPE LEFT AGAIN',
  textBottomSmall: 'to try topup wallet',
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      !viewedPopups.includes('ethereumWallet')
    )
  }
}

export const ADDRESS_QR_BOTTOM_SHEET = {
  title: 'Share this wallet identifier to receive fund from friend',
  tourName: 'addressQR',
  text:
    'You can either share QR or copy the number, which we call it ‘Wallet Address’',
  buttonTextDismiss: 'OK, GOT IT',
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'address-qr' &&
      !viewedPopups.includes('addressQR')
    )
  }
}

export const ROOTCHAIN_POPUP = {
  title: 'The root chain is our main Ethereum blockchain.',
  tourName: 'rootchainPopup',
  text:
    'In this section you can see the value of all your stored coins on the blockchain for this wallet.',
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'up',
  positionTop: 220,
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'rootchain-balance' &&
      viewedPopups.includes('addressQR') &&
      !viewedPopups.includes('rootchainPopup')
    )
  }
}

export const CHILDCHAIN_POPUP = {
  title: 'The Child Chain is Plasma – The OmiseGO Network.',
  tourName: 'childchainPopup',
  text:
    'In this section you can see the funds deposited for transactions on the OmiseGO Network.',
  buttonText: 'GOT IT',
  isPopup: true,
  arrowDirection: 'up',
  positionTop: 220,
  shouldDisplay: (enabledOnboarding, currentPage, viewedPopups) => {
    return (
      enabledOnboarding &&
      currentPage === 'childchain-balance' &&
      viewedPopups.includes('addressQR') &&
      !viewedPopups.includes('childchainPopup')
    )
  }
}
