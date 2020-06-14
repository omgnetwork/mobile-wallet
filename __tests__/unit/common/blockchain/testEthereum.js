import { Ethereum } from 'common/blockchain'
import Config from '../../../config'
import { ethers } from 'ethers'
import { Unit } from 'common/utils'
import { Gas } from 'common/constants'

const mockWalletTransfer = wallet => {
  wallet.sendTransaction = jest.fn()
}

const { TEST_PRIVATE_KEY, TEST_ADDRESS, ETHEREUM_NETWORK } = Config

const testProvider = Ethereum.createProvider(ETHEREUM_NETWORK)

describe('Test Ethereum Boundary', () => {
  it('importWalletMnemonic should return a wallet when given 12-words mnemonic', () => {
    const newMnemonic = Ethereum.generateWalletMnemonic()
    const { signingKey, address } = Ethereum.importWalletMnemonic(newMnemonic)
    const { mnemonic, privateKey } = signingKey
    expect(mnemonic).toBe(newMnemonic)
    expect(privateKey).toBeDefined()
    expect(address).toBeDefined()
  })

  it('sendEthToken should send expected parameters', () => {
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

  it('sendERC20Token should send expected parameters', () => {
    const contract = { transfer: jest.fn() }
    const fee = { amount: '1000000000', symbol: 'wei' }
    const token = { balance: '1', tokenDecimal: 5 }
    const toAddress = TEST_ADDRESS
    const expectedValue = Unit.convert(token.balance, 0, token.tokenDecimal)
    const expectedFee = Unit.convert(fee.amount, 'wei', 'wei')
    Ethereum.sendErc20Token(contract, { fee, token, toAddress })
    expect(contract.transfer).toBeCalledWith(toAddress, expectedValue, {
      gasPrice: expectedFee,
      gasLimit: Gas.LOW_LIMIT
    })
  })

  it('generateWalletMnemonic must not contain duplicate words', () => {
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
