import { plasmaService } from 'common/services'
import { Plasma } from 'common/blockchain'
import { Wait } from 'common/utils'
import { Utxos } from '../helpers'
import BN from 'bn.js'
import { ContractAddress } from 'common/constants'
import Config from '../config'

describe('Test Merge UTXOs', () => {
  // Make sure that the fund wallet has more than 1 ETH in the OMG Network.
  it('given >= 16 utxos, mergeUTXOsIfNeeded should reduce the number of utxos until it is <= 4', async () => {
    const MAXIMUM_UTXOS_PER_CURRENCY = 4
    const MINIMUM_ETH_REQUIRED = new BN('10000000000000000') // 0.01 ETH
    const fundWallet = {
      address: Config.TEST_FUND_ADDRESS,
      privateKey: Config.TEST_FUND_PRIVATE_KEY
    }

    // Check if the test wallet have more than 0.1 ETH
    const testWallet = {
      address: Config.TEST_ADDRESS,
      privateKey: Config.TEST_PRIVATE_KEY
    }

    const fundedToken = {
      contractAddress: ContractAddress.ETH_ADDRESS,
      balance: '1', // 1 ETH
      tokenDecimal: 18
    }

    const utxos = await Plasma.getUtxos(testWallet.address, {
      currency: fundedToken.contractAddress
    })

    console.log('Initial number of utxos: ', utxos.length)

    const highestAmountUtxo = utxos.sort(
      (a, b) => b.amount.length - a.amount.length
    )[0]
    const shouldFund = new BN(highestAmountUtxo.amount).lt(MINIMUM_ETH_REQUIRED)

    console.log('Need more ETH?', shouldFund)

    // Prepare data
    // Split utxos recursively
    if (utxos.length < 10) {
      if (shouldFund) {
        console.log('Waiting for funding 1 ETH...')
        const { blknum: transferBlkNum } = await plasmaService.transfer(
          fundWallet,
          testWallet.address,
          fundedToken
        )

        await Wait.waitChildChainBlknum(fundWallet.address, transferBlkNum)
        console.log('test wallet has been funded successfully.')
      }

      console.log('Need more utxos, waiting for splitting...')
      const newUtxos = await Utxos.splitUntilRoundZero(
        testWallet.address,
        fundedToken.contractAddress,
        testWallet.privateKey,
        2
      )
      console.log(`Split has done, now we have ${newUtxos.length} utxos.`)
    }

    console.log('Waiting for merging...')

    // Merge utxos recursively
    await plasmaService.mergeUTXOsIfNeeded(
      testWallet.address,
      testWallet.privateKey,
      MAXIMUM_UTXOS_PER_CURRENCY
    )

    // Assert if the number of utxos is less than or equal to MAXIMUM_UTXOS_PER_CURRENCY
    const mergedUtxos = await Plasma.getUtxos(testWallet.address, {
      currency: fundedToken.contractAddress
    })

    expect(mergedUtxos.length).toBeLessThanOrEqual(MAXIMUM_UTXOS_PER_CURRENCY)
  }, 300000)
})
