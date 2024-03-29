import { ethereumActions } from 'common/actions'
import { getMockStore } from '../../../helpers/index'
import { ContractAddress } from 'common/constants'
import { ethers } from 'ethers'
import {
  sendErc20Token,
  sendEthToken,
  fetchAssets
} from 'common/services/ethereumService.js'
import { BlockchainParams } from 'common/blockchain'
import Config from 'react-native-config'

jest.mock('common/services/ethereumService')
jest.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => cb())

const { ETHEREUM_NETWORK, TEST_ADDRESS } = Config
const mockTxOptions = {
  hash: 'any',
  value: '1000'
}

const mockStore = getMockStore()
const mockEthereumService = (method, resp) => {
  method.mockReturnValueOnce(Promise.resolve(resp))
}

describe('Test Ethereum Actions', () => {
  test('transfer with erc20 should invoke sendErc20Token and dispatch expected actions to the store', () => {
    const store = mockStore({ unconfirmedTxs: [] })
    mockEthereumService(sendErc20Token, mockTxOptions)

    const sendTransactionParams = BlockchainParams.createSendTransactionParams({
      blockchainWallet: { privateKey: 'privateKey', address: '0x0' },
      toAddress: '0x2',
      amount: '1000000',
      token: {
        balance: '10',
        tokenSymbol: 'OMG',
        tokenDecimal: 18,
        contractAddress: '0x1234'
      },
      gas: 50000,
      gasPrice: 100000
    })

    const { from, to } = sendTransactionParams.addresses
    const { token } = sendTransactionParams.smallestUnitAmount
    const { gas, gasPrice } = sendTransactionParams.gasOptions

    const action = ethereumActions.transfer(sendTransactionParams)
    return store.dispatch(action).then(() => {
      expect(sendErc20Token).toBeCalledWith(sendTransactionParams)
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toStrictEqual([
        { type: 'ROOTCHAIN/SEND_TOKEN/INITIATED' },
        {
          type: 'ROOTCHAIN/SEND_TOKEN/SUCCESS',
          data: {
            hash: mockTxOptions.hash,
            from,
            to,
            value: mockTxOptions.value,
            gasUsed: gas,
            gasPrice,
            actionType: 'ROOTCHAIN_SEND_TOKEN',
            symbol: token.tokenSymbol,
            createdAt: dispatchedActions[1].data.createdAt
          }
        },
        { type: 'LOADING/ROOTCHAIN_SEND_TOKEN/IDLE' }
      ])
    })
  })

  test('transfer with eth should invoke sendEthToken and dispatch expected actions to the store', () => {
    const store = mockStore({ unconfirmedTxs: [] })
    mockEthereumService(sendEthToken, mockTxOptions)

    const sendTransactionParams = BlockchainParams.createSendTransactionParams({
      blockchainWallet: { privateKey: 'privateKey', address: '0x0' },
      toAddress: '0x2',
      amount: '1000000',
      token: {
        balance: '10',
        tokenSymbol: 'ETH',
        tokenDecimal: 18,
        contractAddress: ContractAddress.ETH_ADDRESS
      },
      gas: 50000,
      gasPrice: 100000
    })

    const { from, to } = sendTransactionParams.addresses
    const { token } = sendTransactionParams.smallestUnitAmount
    const { gas, gasPrice } = sendTransactionParams.gasOptions

    const action = ethereumActions.transfer(sendTransactionParams)
    return store.dispatch(action).then(() => {
      expect(sendEthToken).toBeCalledWith(sendTransactionParams)
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toStrictEqual([
        { type: 'ROOTCHAIN/SEND_TOKEN/INITIATED' },
        {
          type: 'ROOTCHAIN/SEND_TOKEN/SUCCESS',
          data: {
            ...mockTxOptions,
            hash: mockTxOptions.hash,
            from,
            to,
            value: mockTxOptions.value,
            gasUsed: gas,
            gasPrice,
            actionType: 'ROOTCHAIN_SEND_TOKEN',
            symbol: token.tokenSymbol,
            createdAt: dispatchedActions[1].data.createdAt
          }
        },
        { type: 'LOADING/ROOTCHAIN_SEND_TOKEN/IDLE' }
      ])
    })
  })

  test('fetchAssets should dispatch expected actions to the store', () => {
    const provider = ethers.getDefaultProvider(ETHEREUM_NETWORK)
    const action = ethereumActions.fetchAssets(provider, TEST_ADDRESS, 0)
    const store = mockStore({ unconfirmedTxs: [] })
    const assets = {
      address: TEST_ADDRESS,
      rootchainAssets: [
        {
          tokenName: 'Euro',
          tokenSymbol: 'EUR',
          tokenDecimal: '18',
          contractAddress: '0xc0912354166d7873f1f9d150c9dc4d80db533467',
          balance: '4845.0',
          price: 1
        },
        {
          tokenName: 'Test',
          tokenSymbol: 'TEST',
          tokenDecimal: '18',
          contractAddress: '0x7f1511708e51a3088e4e8505f16523300668476e',
          balance: '6776.48',
          price: 1
        }
      ],
      updatedBlock: '4880102',
      updatedAt: '2020-01-07T07:37:30Z'
    }
    mockEthereumService(fetchAssets, assets)
    return store.dispatch(action).then(() => {
      expect(fetchAssets).toBeCalledWith(provider, TEST_ADDRESS, 0)
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toStrictEqual([
        { type: 'ROOTCHAIN/FETCH_ASSETS/INITIATED' },
        {
          type: 'ROOTCHAIN/FETCH_ASSETS/SUCCESS',
          data: assets
        },
        { type: 'LOADING/ROOTCHAIN_FETCH_ASSETS/IDLE' }
      ])
    })
  })
})
