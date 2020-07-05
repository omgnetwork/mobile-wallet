import Config from '../config'
import { GasEstimator, BlockchainParams } from 'common/blockchain'

const { TEST_ADDRESS, TEST_ERC20_TOKEN_CONTRACT_ADDRESS } = Config

describe('Test Gas Estimator', () => {
  test('test estimate gas when sending erc20 token', () => {
    const sendTransactionParams = BlockchainParams.createSendTransactionParams({
      blockchainWallet: { address: TEST_ADDRESS },
      toAddress: TEST_ADDRESS,
      token: {
        contractAddress: TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
        balance: '5',
        tokenDecimal: 18
      },
      amount: '1',
      gasPrice: '10000000'
    })

    return GasEstimator.estimateTransferErc20(sendTransactionParams).then(
      gasUsed => {
        expect(gasUsed).toBeDefined()
      }
    )
  }, 15000)
})
