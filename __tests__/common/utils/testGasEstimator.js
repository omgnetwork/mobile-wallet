import { ethers } from 'ethers'
import Config from 'react-native-config'
import { Gas } from 'common/constants'
import { GasEstimator } from 'common/utils'

const { TEST_PRIVATE_KEY, TEST_ADDRESS } = Config

describe('Test Gas Estimator', () => {
  it('test estimate gas when sending erc20 token', () => {
    const provider = ethers.getDefaultProvider('ropsten')
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider)
    const to = TEST_ADDRESS
    const fee = { amount: Gas.LOW_TRANSFER_GAS_PRICE }
    const token = {
      contractAddress: '0xd74ef52053204c9887df4a0e921b1ae024f6fe31',
      balance: '5'
    }

    const pendingGasUsed = GasEstimator.estimateTransferErc20(
      wallet,
      to,
      fee,
      token
    )

    return pendingGasUsed.then(gasUsed => {
      expect(gasUsed.toString(10)).toBeDefined()
    })
  })
})
