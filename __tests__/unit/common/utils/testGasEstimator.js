import { ethers } from 'ethers'
import Config from '../../../config'
import { GasEstimator } from 'common/blockchain'

const {
  TEST_PRIVATE_KEY,
  TEST_ADDRESS,
  ETHEREUM_NETWORK,
  TEST_ERC20_TOKEN_CONTRACT_ADDRESS
} = Config

describe('Test Gas Estimator', () => {
  it('test estimate gas when sending erc20 token', () => {
    const provider = ethers.getDefaultProvider(ETHEREUM_NETWORK)
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider)
    const to = TEST_ADDRESS
    const token = {
      contractAddress: TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
      balance: '0.001',
      tokenDecimal: 18
    }

    const pendingGasUsed = GasEstimator.estimateTransferErc20(wallet, to, token)

    return pendingGasUsed.then((gasUsed) => {
      expect(gasUsed.toString(10)).toBeDefined()
    })
  }, 15000)
})
