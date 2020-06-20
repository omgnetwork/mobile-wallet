import { Ethereum } from 'common/blockchain'
import { web3 } from 'common/clients'
import { TxDetails, GasEstimator } from 'common/blockchain'

jest.mock('common/blockchain/txDetails.js')
jest.mock('common/blockchain/gasEstimator.js')

const mockTransferErc20TxDetails = resp => {
  TxDetails.getTransferErc20.mockReturnValueOnce(resp)
}

const mockTransferEthTxDetails = resp => {
  TxDetails.getTransferEth.mockReturnValueOnce(resp)
}

const mockWeb3EstimateGas = resp => {
  GasEstimator.web3EstimateGas.mockReturnValueOnce(Promise.resolve(resp))
}

const mockWeb3SignTransaction = resp => {
  web3.eth.accounts.signTransaction = jest
    .fn()
    .mockReturnValue(Promise.resolve(resp))
}

const mockWeb3SendSignedTransactionResponse = resp => {
  web3.eth.sendSignedTransaction = jest.fn((_rawTx, callback) =>
    callback(null, resp)
  )
}

describe('Test Ethereum Boundary', () => {
  test('importWalletMnemonic should return a wallet when given 12-words mnemonic', () => {
    const newMnemonic = Ethereum.generateWalletMnemonic()
    const { signingKey, address } = Ethereum.importWalletMnemonic(newMnemonic)
    const { mnemonic, privateKey } = signingKey
    expect(mnemonic).toBe(newMnemonic)
    expect(privateKey).toBeDefined()
    expect(address).toBeDefined()
  })

  test('sendEthToken should send expected parameters', () => {
    const signedTx = { rawTransaction: '0x0' }
    const txDetails = { type: 'sendEthToken' }

    mockTransferEthTxDetails(txDetails)
    mockWeb3SignTransaction(signedTx)
    mockWeb3SendSignedTransactionResponse('0x1')

    const wallet = {
      address: 'any',
      privateKey: 'privateKey'
    }
    const options = {
      fee: 'any',
      token: {
        balance: 1,
        tokenDecimal: 18
      },
      toAddress: 'any'
    }

    return Ethereum.sendEthToken(wallet, options).then(resp => {
      expect(web3.eth.accounts.signTransaction).toBeCalledWith(
        txDetails,
        wallet.privateKey
      )
      expect(web3.eth.sendSignedTransaction).toBeCalledWith(
        signedTx.rawTransaction,
        expect.anything()
      )
      expect(resp).toStrictEqual({ hash: '0x1' })
    })
  })

  test('sendERC20Token should send expected parameters', () => {
    const signedTx = { rawTransaction: '0x0' }
    const mockEstimatedGas = 50000
    const txDetails = { type: 'sendErc20Token' }

    mockWeb3SignTransaction(signedTx)
    mockWeb3SendSignedTransactionResponse('0x1')
    mockWeb3EstimateGas(mockEstimatedGas)
    mockTransferErc20TxDetails(txDetails)

    const contract = 'contract'
    const options = {
      fee: 'any',
      token: {
        balance: 1,
        tokenDecimal: 18
      },
      toAddress: 'any',
      wallet: {
        address: 'any',
        privateKey: 'privateKey'
      }
    }

    return Ethereum.sendErc20Token(contract, options).then(resp => {
      expect(web3.eth.accounts.signTransaction).toBeCalledWith(
        { ...txDetails, gas: mockEstimatedGas },
        options.wallet.privateKey
      )
      expect(web3.eth.sendSignedTransaction).toBeCalledWith(
        signedTx.rawTransaction,
        expect.anything()
      )
      expect(resp).toStrictEqual({ hash: '0x1' })
    })
  })

  test('generateWalletMnemonic must not contain duplicate words', () => {
    let validCount = 0
    for (let i = 0; i < 1000; i++) {
      const mnemonic = Ethereum.generateWalletMnemonic()
      const words = mnemonic.split(' ')
      const totalUniqueWords = new Set(words).size
      const totalWords = words.length
      if (totalUniqueWords === totalWords) {
        validCount++
      }
    }
    expect(validCount).toBe(1000)
  })
})
