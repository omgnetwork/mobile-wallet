import {
  fetchAssets,
  deposit,
  transfer,
  exit
} from 'common/services/plasmaService.js'
import { ethers } from 'ethers'
import { Datetime } from 'common/utils'
import { TransactionActionTypes, TransactionTypes } from 'common/constants'
import Config from 'react-native-config'
import { getMockStore } from '../../../helpers'
import { plasmaActions } from 'common/actions'
import { ContractAddress } from 'common/constants'

jest.mock('common/analytics/crashAnalytics.js')
jest.mock('common/services/plasmaService.js')
jest.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => cb())

const {
  TEST_PRIVATE_KEY,
  TEST_ADDRESS,
  ETHERSCAN_NETWORK,
  ERC20_VAULT_CONTRACT_ADDRESS
} = Config

const mockStore = getMockStore()
const provider = ethers.getDefaultProvider(ETHERSCAN_NETWORK)

const mockDepositTxReceipt = {
  hash: 'any',
  gasPrice: 'any',
  gasUsed: 'any'
}

const mockExitTxReceipt = {
  hash: 'any',
  exitId: 'any',
  blknum: 'any',
  flatFee: 'any',
  to: 'any',
  gasPrice: 'any'
}

const mockPlasmaService = (method, resp) => {
  method.mockReturnValueOnce(Promise.resolve(resp))
}

describe('Test Plasma Actions', () => {
  it('fetchAssets should dispatch actions as expected', () => {
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

  it('deposit with eth should dispatch actions as expected', () => {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY)
    const token = {
      balance: '0.001',
      tokenSymbol: 'ETH',
      tokenDecimal: 18,
      contractAddress: ContractAddress.ETH_ADDRESS
    }
    mockPlasmaService(deposit, mockDepositTxReceipt)

    const store = mockStore({})

    return store.dispatch(plasmaActions.deposit(wallet, token)).then(() => {
      const actions = store.getActions()
      expect(actions).toStrictEqual([
        { type: 'CHILDCHAIN/DEPOSIT/INITIATED' },
        {
          type: 'CHILDCHAIN/DEPOSIT/SUCCESS',
          data: {
            ...mockDepositTxReceipt,
            from: TEST_ADDRESS,
            value: token.balance,
            symbol: token.tokenSymbol,
            tokenDecimal: token.tokenDecimal,
            contractAddress: token.contractAddress,
            actionType: 'CHILDCHAIN_DEPOSIT',
            createdAt: actions[1].data.createdAt
          }
        },
        { type: 'LOADING/CHILDCHAIN_DEPOSIT/IDLE' }
      ])
    })
  })

  it('depositErc20 should dispatch actions as expected', () => {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY)
    const token = {
      balance: '0.001',
      tokenSymbol: 'EUR',
      tokenDecimal: 18,
      contractAddress: ERC20_VAULT_CONTRACT_ADDRESS
    }
    mockPlasmaService(deposit, mockDepositTxReceipt)

    const store = mockStore({})

    return store.dispatch(plasmaActions.deposit(wallet, token)).then(() => {
      const actions = store.getActions()
      expect(actions).toStrictEqual([
        { type: 'CHILDCHAIN/DEPOSIT/INITIATED' },
        {
          type: 'CHILDCHAIN/DEPOSIT/SUCCESS',
          data: {
            ...mockDepositTxReceipt,
            from: TEST_ADDRESS,
            value: token.balance,
            symbol: token.tokenSymbol,
            tokenDecimal: token.tokenDecimal,
            contractAddress: token.contractAddress,
            actionType: 'CHILDCHAIN_DEPOSIT',
            createdAt: actions[1].data.createdAt
          }
        },
        { type: 'LOADING/CHILDCHAIN_DEPOSIT/IDLE' }
      ])
    })
  })

  it('transfer should dispatch actions as expected', () => {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY)
    const toAddress = TEST_ADDRESS
    const token = {
      balance: '0.001',
      tokenSymbol: 'EUR',
      tokenDecimal: 18,
      contractAddress: ERC20_VAULT_CONTRACT_ADDRESS
    }
    const feeToken = token

    mockPlasmaService(transfer, {
      txhash: 'any'
    })

    const store = mockStore({})

    return store
      .dispatch(plasmaActions.transfer(wallet, toAddress, token, feeToken))
      .then(() => {
        const actions = store.getActions()
        expect(actions).toStrictEqual([
          { type: 'CHILDCHAIN/SEND_TOKEN/INITIATED' },
          {
            data: {
              hash: 'any',
              from: wallet.address,
              value: token.balance,
              symbol: token.tokenSymbol,
              tokenDecimal: token.tokenDecimal,
              contractAddress: token.contractAddress,
              gasUsed: 1,
              gasPrice: 1,
              gasToken: feeToken,
              actionType: TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN,
              createdAt: actions[1].data.createdAt
            },
            type: 'CHILDCHAIN/SEND_TOKEN/SUCCESS'
          },
          { type: 'LOADING/CHILDCHAIN_SEND_TOKEN/IDLE' }
        ])
      })
  })

  it('exit should dispatch actions as expected', () => {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY)
    const token = {
      balance: '0.001',
      tokenSymbol: 'EUR',
      tokenDecimal: 18,
      contractAddress: ERC20_VAULT_CONTRACT_ADDRESS
    }

    mockPlasmaService(exit, mockExitTxReceipt)

    const store = mockStore()
    return store.dispatch(plasmaActions.exit(wallet, token)).then(() => {
      const actions = store.getActions()
      expect(actions).toStrictEqual([
        { type: 'CHILDCHAIN/EXIT/INITIATED' },
        {
          data: {
            ...mockExitTxReceipt,
            actionType: 'CHILDCHAIN_EXIT',
            contractAddress: token.contractAddress,
            createdAt: actions[1].data.createdAt,
            from: wallet.address,
            gasUsed: 1,
            smallestValue: '1000000000000000',
            symbol: token.tokenSymbol,
            timestamp: actions[1].data.timestamp,
            tokenDecimal: token.tokenDecimal,
            type: TransactionTypes.TYPE_EXIT,
            value: token.balance
          },
          type: 'CHILDCHAIN/EXIT/SUCCESS'
        },
        { type: 'LOADING/CHILDCHAIN_EXIT/IDLE' }
      ])
    })
  })
})
