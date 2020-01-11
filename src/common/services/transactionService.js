import { ethereumService, plasmaService } from 'common/services'
import { Token } from 'common/blockchain'
import { Mapper } from 'common/utils'

export const getPlasmaTx = oldTransaction => {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = await plasmaService.getTx(oldTransaction.hash)
      const mergedTx = Mapper.mapChildchainTxDetail(oldTransaction, transaction)
      resolve(mergedTx)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

export const getTxs = (address, provider, options) => {
  const { page, limit, lastEthBlockNumber, lastOMGBlockNumber } = options
  return new Promise(async (resolve, reject) => {
    try {
      const queryRootchainOptions = {
        lastEthBlockNumber,
        limit,
        page
      }

      const queryChildchainOptions = {
        blknum: lastOMGBlockNumber,
        limit: limit
      }

      const pendingEthereumTxs = ethereumService.getTxs(
        address,
        queryRootchainOptions,
        false
      )
      const pendingEthereumERC20Txs = ethereumService.getTxs(
        address,
        queryRootchainOptions,
        true
      )
      const childchainTxs = await plasmaService.getTxs(
        address,
        queryChildchainOptions
      )

      const pristineChildchainTxs = excludeSplittedTxs(childchainTxs)

      const currencies = pristineChildchainTxs.map(
        tx => Mapper.mapInputTransfer(tx).currency
      )

      const contractAddresses = Array.from(new Set(currencies))

      const tokenMap = await Token.fetchTokens(
        provider,
        contractAddresses,
        address
      )

      const tokens = Object.keys(tokenMap).map(
        contractAddress => tokenMap[contractAddress]
      )

      const transactions = await Promise.all([
        pendingEthereumTxs,
        pendingEthereumERC20Txs
      ]).then(([rootchainTxs, rootchainErc20Txs]) => {
        const txs = {
          rootchainTxs,
          rootchainErc20Txs,
          childchainTxs: pristineChildchainTxs
        }
        return mergeTxs(txs, address, tokens)
      })

      // Return result
      resolve(transactions)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

const excludeSplittedTxs = txs => {
  return txs.filter(tx => {
    const inputAddresses = tx.inputs.map(input => input.owner)
    const outputAddresses = tx.outputs.map(output => output.owner)
    return new Set([...inputAddresses, ...outputAddresses]).size > 1
  })
}

const mergeTxs = async (txs, address, tokens) => {
  const cachedErc20 = {}

  const { rootchainTxs, rootchainErc20Txs, childchainTxs } = txs

  // Cache tx details
  rootchainErc20Txs.forEach(tx => {
    cachedErc20[tx.hash] = tx
  })

  rootchainTxs.forEach(tx => {
    if (cachedErc20[tx.hash]) {
      cachedErc20[tx.hash] = {
        ...cachedErc20[tx.hash],
        input: tx.input,
        success: tx.isError === '0'
      }
    }
  })

  const mappedRootchainTxs = rootchainTxs.map(tx =>
    Mapper.mapRootchainTx(tx, address, cachedErc20)
  )

  const mappedChildchainTxs = childchainTxs.map(tx =>
    Mapper.mapChildchainTx(tx, tokens, address)
  )

  return [...mappedRootchainTxs, ...mappedChildchainTxs].sort(
    (a, b) => b.timestamp - a.timestamp
  )
}
