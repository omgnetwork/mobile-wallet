import { fetchAssets, depositEth } from 'common/services/plasmaService.js'
import { ethers } from 'ethers'
import { Datetime } from 'common/utils'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import Config from 'react-native-config'
import { plasmaActions } from 'common/actions'
import BN from 'bn.js'

jest.mock('common/analytics/crashAnalytics.js')
jest.mock('common/services/plasmaService.js')
jest.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => cb())

const { TEST_PRIVATE_KEY, TEST_ADDRESS, ETHERSCAN_NETWORK } = Config
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({})
const provider = ethers.getDefaultProvider(ETHERSCAN_NETWORK)
const mockFetchAssetsResponse = resp => {
  fetchAssets.mockReturnValueOnce(Promise.resolve(resp))
}
const mockDepositEthResponse = resp => {
  depositEth.mockReturnValueOnce(Promise.resolve(resp))
}
describe('Plasma Action Test', () => {
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

    mockFetchAssetsResponse({ fromUtxoPos: '0', childchainAssets, updatedAt })

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

  it('depositEth should dispatch actions as expected', () => {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY)
    const token = { balance: '0.001', tokenSymbol: 'ETH', tokenDecimal: 18 }
    //mockDepositEthResponse({
    // transactionHash: ""

    //})
    return store.dispatch(plasmaActions.depositEth(wallet, token)).then(() => {
      console.log(store.getActions())
    })
  })
})
