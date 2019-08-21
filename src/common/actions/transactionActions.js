import { transactionService, walletService } from '../services'
import { createAsyncAction } from './actionCreators'

export const sendErc20Token = (token, fromWallet, provider, toAddress) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(
      fromWallet.address,
      provider
    )
    const tx = await transactionService.sendErc20Token(
      token,
      blockchainWallet,
      toAddress
    )

    return {
      hash: tx.hash,
      from: tx.from,
      nonce: tx.nonce,
      gasPrice: tx.gasPrice.toString()
    }
  }

  return createAsyncAction({
    type: 'TRANSACTION/SEND_ERC20_TOKEN',
    operation: asyncAction
  })
}

export const sendEthToken = (token, fromWallet, provider, toAddress) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(
      fromWallet.address,
      provider
    )
    const tx = await transactionService.sendEthToken(
      token,
      blockchainWallet,
      toAddress
    )

    console.log(tx)

    return {
      hash: tx.hash,
      from: tx.from,
      nonce: tx.nonce,
      gasPrice: tx.gasPrice.toString()
    }
  }

  return createAsyncAction({
    type: 'TRANSACTION/SEND_ETH_TOKEN',
    operation: asyncAction
  })
}
