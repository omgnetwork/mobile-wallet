import { ethers } from 'ethers'
import Config from '../../../config'
import { Gas } from 'common/constants'
import { GasEstimator } from 'common/blockchain'

const {
  TEST_PRIVATE_KEY,
  TEST_ADDRESS,
  TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
  ETHEREUM_NETWORK
} = Config

describe('Test Gas Estimator', () => {
  it('test estimate gas when sending erc20 token', () => {
    const provider = ethers.getDefaultProvider(ETHEREUM_NETWORK)
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider)
    const to = TEST_ADDRESS
    const fee = { amount: Gas.LOW_TRANSFER_GAS_PRICE }
    const token = {
      contractAddress: TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
      balance: '5',
      tokenDecimal: 18
    }

    const pendingGasUsed = GasEstimator.estimateTransferErc20(wallet, to, token)

    return pendingGasUsed.then(gasUsed => {
      expect(gasUsed.toString(10)).toBeDefined()
    })
  }, 15000)
})
