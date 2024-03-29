import {
  fetchAssets,
  deposit,
  transfer,
  exit
} from 'common/services/plasmaService.js'
import { ethers } from 'ethers'
import { Datetime } from 'common/utils'
import { BlockchainParams } from 'common/blockchain'
import { TransactionActionTypes, TransactionTypes } from 'common/constants'
import Config from 'react-native-config'
import { getMockStore } from '../../../helpers'
import { plasmaActions } from 'common/actions'
import { Gas } from 'common/constants'

jest.mock('common/services/plasmaService.js')
jest.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => cb())

const {
  TEST_PRIVATE_KEY,
  TEST_ADDRESS,
  ETHEREUM_NETWORK,
  ERC20_VAULT_CONTRACT_ADDRESS,
  PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
} = Config

const mockStore = getMockStore()
const provider = ethers.getDefaultProvider(ETHEREUM_NETWORK)

const mockDepositTxReceipt = {
  hash: 'any',
  value: '10000'
}

const mockExitTxReceipt = {
  hash: 'any',
  exitId: 'any',
  blknum: 'any',
  flatFee: 'any',
  value: 'any'
}

const mockPlasmaService = (method, resp) => {
  method.mockReturnValueOnce(Promise.resolve(resp))
}

describe('Test Plasma Actions', () => {
  test('fetchAssets should dispatch actions as expected', () => {
    const childchainAssets = [
      {
        tokenName: 'Ether',
        tokenSymbol: 'ETH',
        tokenDecimal: 18,
        price: 126.28,
        contractAddress: '0x0000000000000000000000000000000000000000',
        balance: '2.5529886505'
      },
      {
        tokenName: 'Starbuck',
        tokenSymbol: 'STB',
        tokenDecimal: 18,
        price: 1,
        contractAddress: '0x50b390a7c935680a2529052d1e526886b3e3db22',
        balance: '106.99'
      },
      {
        tokenName: 'Euro',
        tokenSymbol: 'EUR',
        tokenDecimal: 18,
        price: 1,
        contractAddress: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        balance: '33.0'
      }
    ]
    const updatedAt = Datetime.now()

    mockPlasmaService(fetchAssets, {
      fromUtxoPos: '0',
      childchainAssets,
      updatedAt
    })

    const store = mockStore({})
    return store
      .dispatch(plasmaActions.fetchAssets(provider, TEST_ADDRESS))
      .then(() => {
        expect(store.getActions()).toStrictEqual([
          { type: 'CHILDCHAIN/FETCH_ASSETS/INITIATED' },
          {
            type: 'CHILDCHAIN/FETCH_ASSETS/SUCCESS',
            data: {
              address: TEST_ADDRESS,
              childchainAssets,
              fromUtxoPos: '0',
              updatedAt
            }
          },
          { type: 'LOADING/CHILDCHAIN_FETCH_ASSETS/IDLE' }
        ])
      })
  })
  test('deposit should dispatch actions as expected', () => {
    mockPlasmaService(deposit, mockDepositTxReceipt)

    const store = mockStore({})

    const sendTransactionParams = BlockchainParams.createSendTransactionParams({
      blockchainWallet: { privateKey: 'privateKey', address: '0x0' },
      toAddress: '0x2',
      amount: '1000000',
      token: {
        balance: '0.001',
        tokenSymbol: 'EUR',
        tokenDecimal: 18,
        contractAddress: ERC20_VAULT_CONTRACT_ADDRESS
      },
      gas: 1,
      gasPrice: 0.00003
    })

    const { token } = sendTransactionParams.smallestUnitAmount
    const { from, to } = sendTransactionParams.addresses
    const { gas, gasPrice } = sendTransactionParams.gasOptions

    return store
      .dispatch(plasmaActions.deposit(sendTransactionParams))
      .then(() => {
        const actions = store.getActions()
        expect(actions).toStrictEqual([
          { type: 'CHILDCHAIN/DEPOSIT/INITIATED' },
          {
            type: 'CHILDCHAIN/DEPOSIT/SUCCESS',
            data: {
              ...mockDepositTxReceipt,
              from,
              to,
              value: mockDepositTxReceipt.value,
              symbol: token.tokenSymbol,
              tokenDecimal: token.tokenDecimal,
              contractAddress: token.contractAddress,
              gasUsed: gas,
              gasPrice,
              actionType: 'CHILDCHAIN_DEPOSIT',
              createdAt: actions[1].data.createdAt
            }
          },
          { type: 'LOADING/CHILDCHAIN_DEPOSIT/IDLE' }
        ])
      })
  })

  test('transfer should dispatch actions as expected', () => {
    const transferResponse = {
      hash: 'any',
      value: '10000'
    }
    mockPlasmaService(transfer, transferResponse)

    const sendTransactionParams = BlockchainParams.createSendTransactionParams({
      blockchainWallet: { privateKey: 'privateKey', address: '0x0' },
      toAddress: '0x2',
      amount: '1000000',
      token: {
        balance: '0.001',
        tokenSymbol: 'EUR',
        tokenDecimal: 18,
        contractAddress: ERC20_VAULT_CONTRACT_ADDRESS
      },
      gas: 1,
      gasPrice: 0.00003,
      gasToken: {
        contractAddress: ERC20_VAULT_CONTRACT_ADDRESS
      }
    })

    const { token } = sendTransactionParams.smallestUnitAmount
    const { from, to } = sendTransactionParams.addresses
    const { gas, gasPrice, gasToken } = sendTransactionParams.gasOptions

    const store = mockStore({})

    return store
      .dispatch(plasmaActions.transfer(sendTransactionParams))
      .then(() => {
        const actions = store.getActions()
        expect(actions).toStrictEqual([
          { type: 'CHILDCHAIN/SEND_TOKEN/INITIATED' },
          {
            data: {
              hash: 'any',
              from,
              to,
              value: transferResponse.value,
              symbol: token.tokenSymbol,
              tokenDecimal: token.tokenDecimal,
              contractAddress: token.contractAddress,
              gasUsed: gas,
              gasPrice,
              gasToken,
              actionType: TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN,
              createdAt: actions[1].data.createdAt
            },
            type: 'CHILDCHAIN/SEND_TOKEN/SUCCESS'
          },
          { type: 'LOADING/CHILDCHAIN_SEND_TOKEN/IDLE' }
        ])
      })
  })

  test('exit should dispatch actions as expected', () => {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY)
    const token = {
      balance: '0.001',
      tokenSymbol: 'EUR',
      tokenDecimal: 18,
      price: 'any',
      contractAddress: ERC20_VAULT_CONTRACT_ADDRESS
    }
    mockPlasmaService(exit, mockExitTxReceipt)

    const sendTransactionParams = BlockchainParams.createSendTransactionParams({
      blockchainWallet: wallet,
      toAddress: PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS,
      token,
      amount: '0.0001',
      gas: 500000,
      gasPrice: Gas.EXIT_GAS_PRICE
    })

    const store = mockStore()
    return store
      .dispatch(plasmaActions.exit(sendTransactionParams))
      .then(() => {
        const actions = store.getActions()
        expect(actions).toStrictEqual([
          { type: 'CHILDCHAIN/EXIT/INITIATED' },
          {
            data: {
              ...mockExitTxReceipt,
              to: PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS,
              actionType: 'CHILDCHAIN_EXIT',
              contractAddress: token.contractAddress,
              createdAt: actions[1].data.createdAt,
              from: wallet.address,
              tokenPrice: 'any',
              gasPrice: sendTransactionParams.gasOptions.gasPrice,
              gasUsed: sendTransactionParams.gasOptions.gas,
              smallestValue: '100000000000000',
              symbol: token.tokenSymbol,
              timestamp: actions[1].data.timestamp,
              tokenDecimal: token.tokenDecimal,
              type: TransactionTypes.TYPE_EXIT,
              value: 'any'
            },
            type: 'CHILDCHAIN/EXIT/SUCCESS'
          },
          { type: 'LOADING/CHILDCHAIN_EXIT/IDLE' }
        ])
      })
  })
})
