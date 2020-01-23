import Config from 'react-native-config'

export default {
  ...Config,
  TEST_WALLET_ADDRESS_FOR_TOKENS: '0x357829df016316d8DC40a54f0a8D84D53B0D76dD', // This address contains all tokens below
  TEST_TOKENS: [
    '0x0000000000000000000000000000000000000000', // ETH
    '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', // DAI return bytes32 symbol and name
    '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', // OMG return string symbol and name
    '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e', // KICK return decimal 8
    '0x2630997aab62fa1030a8b975e1aa2dc573b18a13' // HYP return bytes8 symbol and bytes32 name.
  ]
}
