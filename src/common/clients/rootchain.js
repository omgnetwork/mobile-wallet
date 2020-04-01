import { RootChain } from '@omisego/react-native-omg-js'

export default (web3, plasmaContractAddress) =>
  new RootChain({
    web3,
    plasmaContractAddress
  })
