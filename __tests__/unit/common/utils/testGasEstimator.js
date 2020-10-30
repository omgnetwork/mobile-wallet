import { ethers } from 'ethers'
import Config from '../../../config'
import { Gas } from 'common/constants'
import { GasEstimator } from 'common/blockchain'

const { TEST_PRIVATE_KEY, TEST_ADDRESS, TEST_TOKENS, ETHEREUM_NETWORK } = Config

const [_, _DAI, OMG] = TEST_TOKENS

describe('Test Gas Estimator', () => {
  it.skip('test estimate gas when sending erc20 token', () => {
    const provider = ethers.getDefaultProvider('homestead')
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider)
    const to = TEST_ADDRESS
    const token = {
      contractAddress: OMG,
      balance: '1',
      tokenDecimal: 18
    }

    const pendingGasUsed = GasEstimator.estimateTransferErc20(wallet, to, token)

    return pendingGasUsed.then((gasUsed) => {
      expect(gasUsed.toString(10)).toBeDefined()
    })
  }, 15000)
})
