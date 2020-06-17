import Config from '../config'
import { GasEstimator } from 'common/blockchain'

const { TEST_ADDRESS, TEST_ERC20_TOKEN_CONTRACT_ADDRESS } = Config

describe('Test Gas Estimator', () => {
  it('test estimate gas when sending erc20 token', () => {
    const token = {
      contractAddress: TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
      balance: '5',
      tokenDecimal: 18
    }

    return GasEstimator.estimateTransferErc20(
      TEST_ADDRESS,
      TEST_ADDRESS,
      token
    ).then(gasUsed => {
      expect(gasUsed.toString(10)).toBeDefined()
    })
  }, 15000)
})
