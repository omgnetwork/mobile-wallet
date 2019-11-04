const content = [
  {
    modalType: null,
    header: 'Welcome to your OmiseGO powered wallet',
    paragraphs: [
      'This wallet is your official gateway to the OmiseGO network.',
      'This application has been set up for educational purposes, to provide insight on how the Plasma Layer 2 solution works. Transactions on wallet will be using ETH in real time and may incur transaction charges. Practice prudence with each transaction.'
    ],

    buttonTextRight: 'TAKE A TOUR',
    buttonTextLeft: 'NO THANKS'
  },
  {
    modalType: 'triangle-up',
    header: 'Manage your wallets here',
    paragraphs: [
      'All your wallets will be managed under this tab. "Manage Wallets" lets you add and remove wallets, as well as edit their names.'
    ]
  },
  {
    modalType: 'triangle-up',
    header: 'Your new public address and QR code',
    paragraphs: [
      'This is how people can find you on the network. Use this code for a deposit'
    ]
  },
  {
    modalType: 'triangle-up',
    header: 'The root chain is the main Ethereum blockchain',
    paragraphs: [
      'In this section you can see the root chain balance of this wallet'
    ]
  },
  {
    modalType: 'triangle-up',
    header: 'The Child Chain is Plasma - the OmiseGO Network',
    paragraphs: [
      'In this section you can see the the funds deposited for transactions on the OmiseGO Network'
    ]
  }
]

export default content
