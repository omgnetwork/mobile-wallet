import {
  Plasma,
  Ethereum,
  TxDetails,
  BlockchainParams
} from 'common/blockchain'
import { Plasma as PlasmaClient } from 'common/clients'
import Config from 'react-native-config'
import BN from 'bn.js'
import { ContractAddress } from 'common/constants'

jest.mock('@omisego/react-native-omg-js')
jest.mock('common/blockchain/gasEstimator.js')
jest.mock('common/blockchain/wait.js')
jest.mock('common/blockchain/ethereum.js')
jest.mock('common/blockchain/txDetails.js')
jest.mock('common/blockchain/contract.js')

const { getBalance } = PlasmaClient.ChildChain
const { getDeposit } = TxDetails
const { signSendTx } = Ethereum
const { TEST_ADDRESS, TEST_PRIVATE_KEY } = Config

const FIVE_GWEI = '5000000000'

const mockGetBalancesResponse = resp => {
  getBalance.mockReturnValueOnce(Promise.resolve(resp))
}

const mockGetDepositTxDetails = resp => {
  getDeposit.mockReturnValueOnce(resp)
}

const mockSignSendTx = resp => {
  signSendTx.mockReturnValueOnce(resp)
}

describe('Test Plasma Boundary', () => {
  test('getBalances should return BN amount as a string', () => {
    const balances = [
      {
        amount: new BN('5000000000'),
        currency: '0x0000000000000000000000000000000000000000'
      }
    ]
    mockGetBalancesResponse(balances)

    return Plasma.getBalances(TEST_ADDRESS).then(data => {
      expect(data).toEqual([
        {
          amount: '5000000000',
          currency: '0x0000000000000000000000000000000000000000'
        }
      ])
    })
  })

  test('deposit should invoke the deposit function with expected parameters', () => {
    const txDetails = {}
    const expectedResponse = { hash: '0x1' }
    const sendTransactionParams = BlockchainParams.createSendTransactionParams({
      blockchainWallet: { privateKey: TEST_PRIVATE_KEY, address: TEST_ADDRESS },
      toAddress: TEST_ADDRESS,
      token: { contractAddress: ContractAddress.ETH_ADDRESS, tokenDecimal: 18 },
      amount: FIVE_GWEI,
      gas: null,
      gasPrice: '6000000'
    })

    mockGetDepositTxDetails(txDetails)
    mockSignSendTx(expectedResponse)

    return Plasma.deposit(sendTransactionParams).then(resp => {
      expect(getDeposit).toBeCalledWith(sendTransactionParams)
      expect(signSendTx).toBeCalledWith(txDetails, TEST_PRIVATE_KEY)
      expect(resp).toBe(expectedResponse)
    })
  })
})
