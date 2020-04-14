import Web3 from 'web3'

export default web3HttpProvider => {
  const provider = new Web3.providers.HttpProvider(web3HttpProvider)
  return new Web3(provider, null, {
    transactionConfirmationBlocks: 1
  })
}
