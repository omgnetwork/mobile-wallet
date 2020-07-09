import { plasmaService } from 'common/services'
import {
  Wait,
  Utxos,
  Plasma,
  BlockchainParams,
  Transaction
} from 'common/blockchain'
import BN from 'bn.js'
import { ContractAddress } from 'common/constants'
import Config from '../config'

function splitUTXOs({ addresses, privateKey, smallestUnitAmount, gasOptions }) {
  const { utxo, amount } = smallestUnitAmount
  const { from } = addresses
  const { feeToken } = gasOptions

  const fromUtxos = [utxo]
  const payment = Transaction.createPayment(from, utxo.currency, amount)
  const payments = new Array(3).fill(payment)
  const metadata = 'Split Utxo'
  const txBody = Transaction.createBody(
    from,
    fromUtxos,
    payments,
    feeToken,
    metadata
  )
  const typedData = Transaction.getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(privateKey)
  const signatures = Transaction.sign(typedData, privateKeys)
  const signedTxn = Transaction.buildSigned(typedData, signatures)
  return Transaction.submit(signedTxn)
}

// Recursively split the utxos for the given currency until the given round is zero
// For example, the address has 1 utxo with 10000 wei amount.
// Given rounds = 2, it will split the utxo as following:
// Round 2: [10000] -> [1000*4] (1000*4 is a short-handed for [600, 600, 600, 600])
// Round 1: [6000, 1000, 1000, 1000, 1000] -> [600*4, 100*4, 100*4, 100*4, 100*4]
// Round 0: Returns [600*4, 100*4, 100*4, 100*4, 100*4] (Total 20 UTXOs)
// Note: Cloudflare is starting to deny the request when rounds >= 7.
export const splitUntilRoundZero = async (sendTransactionParams, rounds) => {
  const { addresses, smallestUnitAmount, gasOptions } = sendTransactionParams
  const { from } = addresses
  const { token } = smallestUnitAmount
  const { feeToken } = gasOptions

  const utxos = await Utxos.get(from, {
    currency: token.contractAddress
  })

  if (rounds === 0) return utxos
  const amount = Math.pow(10, rounds) * feeToken.amount

  const candidateUtxos = utxos.filter(utxo => utxo.amount >= amount)

  console.log(candidateUtxos)

  const splittedUtxos = candidateUtxos.map(utxo => {
    return splitUTXOs({
      ...sendTransactionParams,
      smallestUnitAmount: {
        ...smallestUnitAmount,
        amount,
        utxo
      }
    })
  })
  console.log('Rounds left: ', rounds)
  const receipts = await Promise.all(splittedUtxos)
  const { blknum } = receipts.sort((a, b) => b.blknum - a.blknum)[0]
  console.log(`Splitted successfully. Waiting for block ${blknum}...`)
  await Wait.waitChildChainBlknum(from, blknum)
  return await splitUntilRoundZero(sendTransactionParams, rounds - 1)
}

describe('Test Merge UTXOs', () => {
  // Make sure that the fund wallet has more than 1 ETH in the OMG Network.
  // This test can be run only once at a time, otherwise it will failed due to :utxo_not_found
  test('given a number of utxos > 1, it should reduce the number of utxos until it is <= 1', async () => {
    const MAXIMUM_UTXOS_PER_CURRENCY = 1
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

    if (utxos.length <= MAXIMUM_UTXOS_PER_CURRENCY) {
      const shouldFund = new BN(bigUtxo.amount).lt(MINIMUM_ETH_REQUIRED)

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

      const splitTransactionParams = BlockchainParams.createSendTransactionParams(
        {
          blockchainWallet: testWallet,
          token: fundedToken,
          amount,
          feeToken: { currency, amount }
        }
      )

      const newUtxos = await splitUntilRoundZero(splitTransactionParams, 2)
      console.log(
        `Split has done, now the wallet ${testWallet.address} has ${newUtxos.length} utxos.`
      )
    }

    const listOfRequiredMergeUtxos = await Utxos.get(testWallet.address)
      .then(Utxos.mapByCurrency)
      .then(utxosMap =>
        Utxos.filterOnlyGreaterThanMaximum(utxosMap, MAXIMUM_UTXOS_PER_CURRENCY)
      )

    // Merge utxos recursively
    console.log('Waiting for merging...')
    await plasmaService.mergeUTXOs(
      testWallet.address,
      testWallet.privateKey,
      MAXIMUM_UTXOS_PER_CURRENCY,
      listOfRequiredMergeUtxos
    )

    // Assert if the number of utxos is less than or equal to MAXIMUM_UTXOS_PER_CURRENCY
    return Utxos.get(testWallet.address, {
      currency: fundedToken.contractAddress
    }).then(mergedUtxos => {
      expect(mergedUtxos.length).toBeLessThanOrEqual(MAXIMUM_UTXOS_PER_CURRENCY)
    })
  }, 600000)
})
