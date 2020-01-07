import { ethereumActions } from 'common/actions'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { ethers } from 'ethers'
import { sendErc20Token } from 'common/services/ethereumService.js'
import Config from 'react-native-config'

jest.mock('common/services/ethereumService')

const { TEST_PRIVATE_KEY, TEST_ADDRESS } = Config
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const mockSendErc20Token = resp => {
  sendErc20Token.mockReturnValueOnce(Promise.resolve(resp))
}
jest.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => cb())

describe('Test Ethereum Actions', () => {
  it('sendErc20Token should dispatch expected actions to the store', () => {
    const token = { balance: '10', tokenSymbol: 'OMG', tokenDecimal: 18 }
    const fee = { amount: '10', symbol: 'gwei' }
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY)
    const toAddress = TEST_ADDRESS
    const store = mockStore({ unconfirmedTxs: [] })
    mockSendErc20Token({
      hash: 'any',
      from: 'any',
      nonce: 'any',
      gasPrice: 'any'
    })
    const action = ethereumActions.sendErc20Token(token, fee, wallet, toAddress)
    return store.dispatch(action).then(() => {
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).toStrictEqual([
        { type: 'ROOTCHAIN/SEND_ERC20_TOKEN/INITIATED' },
        {
          type: 'ROOTCHAIN/SEND_ERC20_TOKEN/SUCCESS',
          data: {
            hash: 'any',
            from: 'any',
            to: toAddress,
            nonce: 'any',
            value: token.balance,
            actionType: 'ROOTCHAIN_SEND',
            symbol: token.tokenSymbol,
            gasPrice: 'any',
            createdAt: dispatchedActions[1].data.createdAt
          }
        },
        { type: 'LOADING/ROOTCHAIN_SEND_ERC20_TOKEN/IDLE' }
      ])
    })
  })
})
