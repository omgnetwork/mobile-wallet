import { ethereumService, plasmaService } from 'common/services'
import { Mapper, Token } from 'common/utils'

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
        queryRootchainOptions
      )
      const pendingEthereumERC20Txs = ethereumService.getERC20Txs(
        address,
        queryRootchainOptions
      )
      const childchainTxs = await plasmaService.getTxs(
        address,
        queryChildchainOptions
      )

      const currencies = childchainTxs.map(Mapper.mapCurrency)

      const contractAddresses = Array.from(new Set(currencies))

      const tokens = await Token.fetchTokens(provider, contractAddresses)

      const transactions = await Promise.all([
        pendingEthereumTxs,
        pendingEthereumERC20Txs
      ]).then(([rootchainTxs, rootchainErc20Txs]) => {
        const txs = {
          rootchainTxs,
          rootchainErc20Txs,
          childchainTxs
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
    Mapper.mapChildchainTx(tx, tokens)
  )

  return [...mappedRootchainTxs, ...mappedChildchainTxs].sort(
    (a, b) => b.timestamp - a.timestamp
  )
}
