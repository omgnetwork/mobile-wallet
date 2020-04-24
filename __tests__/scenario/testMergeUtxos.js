import { plasmaService } from 'common/services'
import { Wait, Utxos, Plasma } from 'common/blockchain'
import BN from 'bn.js'
import { ContractAddress } from 'common/constants'
import Config from '../config'

describe('Test Merge UTXOs', () => {
  // Make sure that the fund wallet has more than 1 ETH in the OMG Network.
  it('given >= 16 utxos, mergeUTXOs should reduce the number of utxos until it is <= 4', async () => {
    const MAXIMUM_UTXOS_PER_CURRENCY = 4
    const MINIMUM_ETH_REQUIRED = new BN('10000000000000000') // 0.01 ETH
    const fundWallet = {
      address: Config.TEST_FUND_ADDRESS,
      privateKey: Config.TEST_FUND_PRIVATE_KEY
    }

    const testWallet = {
      address: Config.TEST_ADDRESS,
      privateKey: Config.TEST_PRIVATE_KEY
    }

    const fundedToken = {
      contractAddress: ContractAddress.ETH_ADDRESS,
      balance: '1', // 1 ETH, not 1 Wei
      tokenDecimal: 18
    }

    const utxos = await Utxos.get(testWallet.address, {
      currency: fundedToken.contractAddress
    })

    console.log('Number of UTXOs: ', utxos.length)

    const bigUtxo = utxos.sort((a, b) => b.amount.length - a.amount.length)[0]
    // Check if the test wallet have more than 0.1 ETH
    const shouldFund = new BN(bigUtxo.amount).lt(MINIMUM_ETH_REQUIRED)

    if (utxos.length <= MAXIMUM_UTXOS_PER_CURRENCY) {
      // Check before split if we need to get more fund in the test wallet.
      console.log('Need more ETH?', shouldFund)
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

      const availableFees = await Plasma.getFees([ContractAddress.ETH_ADDRESS])
      const { currency, amount } = availableFees[0]
      const newUtxos = await Utxos.splitUntilRoundZero(
        testWallet.address,
        fundedToken.contractAddress,
        testWallet.privateKey,
        2,
        { currency, amount }
      )
      console.log(
        `Split has done, now the wallet ${testWallet.address} has ${newUtxos.length} utxos.`
      )
    }

    const listOfUtxos = await Utxos.getRequiredMerge(
      testWallet.address,
      null,
      MAXIMUM_UTXOS_PER_CURRENCY
    )

    // Merge utxos recursively
    console.log('Waiting for merging...')
    await plasmaService.mergeUTXOs(
      testWallet.address,
      testWallet.privateKey,
      MAXIMUM_UTXOS_PER_CURRENCY,
      listOfUtxos
    )

    // Assert if the number of utxos is less than or equal to MAXIMUM_UTXOS_PER_CURRENCY
    const mergedUtxos = await Utxos.get(testWallet.address, {
      currency: fundedToken.contractAddress
    })

    expect(mergedUtxos.length).toBeLessThanOrEqual(MAXIMUM_UTXOS_PER_CURRENCY)
  }, 600000)
})
