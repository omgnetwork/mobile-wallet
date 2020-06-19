import { Ethereum } from 'common/blockchain'
import Config from '../../../config'
import { ethers } from 'ethers'
import { Unit } from 'common/utils'
import { Gas } from 'common/constants'
import { web3 } from 'common/clients'

const mockWalletTransfer = wallet => {
  wallet.sendTransaction = jest.fn()
}

const mockWeb3SignTransaction = resp => {
  web3.eth.accounts.signTransaction = jest
    .fn()
    .mockReturnValueOnce(Promise.resolve(resp))
}

const mockWeb3SendSignedTransactionResponse = resp => {
  web3.eth.sendSignedTransaction = jest.fn((_rawTx, callback) =>
    callback(null, resp)
  )
}

const { TEST_PRIVATE_KEY, TEST_ADDRESS, ETHEREUM_NETWORK } = Config

const testProvider = Ethereum.createProvider(ETHEREUM_NETWORK)

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
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, testProvider)
    mockWalletTransfer(wallet)
    const fee = { amount: '1000000000', symbol: 'wei' }
    const token = { balance: '1', numberOfDecimals: 18 }
    const toAddress = TEST_ADDRESS
    const expectedValue = Unit.convert(token.balance, 0, token.numberOfDecimals)
    const expectedFee = Unit.convert(fee.amount, 'wei', 'wei')
    Ethereum.sendEthToken(wallet, { fee, token, toAddress })
    expect(wallet.sendTransaction).toBeCalledWith({
      to: toAddress,
      value: expectedValue,
      gasPrice: expectedFee,
      gasLimit: Gas.LOW_LIMIT
    })
  })

  test('sendERC20Token should send expected parameters', () => {
    const mockEncodeAbi = jest.fn(() => '0x')
    const mocktransfer = jest.fn(() => ({
      encodeABI: mockEncodeAbi
    }))
    mockWeb3SignTransaction({ rawTransaction: '0x0' })
    mockWeb3SendSignedTransactionResponse('0x1')

    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, testProvider)
    const contract = { methods: { transfer: mocktransfer } }
    const fee = { amount: '1000000000', symbol: 'wei' }
    const token = { balance: '1', tokenDecimal: 5, contractAddress: '0x1234' }
    const toAddress = '0x1'
    const expectedValue = Unit.convertToString(
      token.balance,
      0,
      token.tokenDecimal
    )

    const response = Ethereum.sendErc20Token(contract, {
      fee,
      token,
      toAddress,
      wallet
    })
    expect(contract.methods.transfer).toBeCalledWith(toAddress, expectedValue)
    expect(mockEncodeAbi).toBeCalled()
    expect(web3.eth.accounts.signTransaction).toBeCalledWith(
      {
        data: '0x',
        from: wallet.address,
        gasLimit: Gas.LOW_LIMIT,
        gasPrice: fee.amount,
        to: toAddress
      },
      wallet.privateKey
    )
    return response.then(resp => expect(resp).toStrictEqual({ hash: '0x1' }))
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
