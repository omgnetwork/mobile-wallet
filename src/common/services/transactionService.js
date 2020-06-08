import { ethereumService, plasmaService } from 'common/services'
import { Token, Plasma, Transaction } from 'common/blockchain'
import { BigNumber } from 'common/utils'
import { Mapper } from 'common/utils'

export const getPlasmaTx = async oldTransaction => {
  try {
    const transaction = await plasmaService.getTx(oldTransaction.hash)
    return Mapper.mapChildchainTxDetail(oldTransaction, transaction)
  } catch (err) {
    throw new Error(err)
  }
}

export const getTxs = async (address, provider, options) => {
  const { page, limit, lastEthBlockNumber, lastOMGBlockNumber } = options

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
    const pendingEthereumInternalTxs = ethereumService.getInternalTxs(
      address,
      queryRootchainOptions
    )
    const childchainTxs = await plasmaService.getTxs(
      address,
      queryChildchainOptions
    )

    const standardExitBondSize = await Plasma.getStandardExitBond()

    const pristineChildchainTxs = excludeSplittedTxs(childchainTxs)

    const currencies = pristineChildchainTxs.map(
      tx => Mapper.mapInputTransfer(tx).currency
    )

    const contractAddresses = Array.from(new Set(currencies))

    const tokenMap = await Token.all(provider, contractAddresses, address)

    const tokens = Object.keys(tokenMap).map(
      contractAddress => tokenMap[contractAddress]
    )

    const transactions = await Promise.all([
      pendingEthereumTxs,
      pendingEthereumERC20Txs,
      pendingEthereumInternalTxs
    ]).then(([rootchainTxs, rootchainErc20Txs, rootchainInternalTxs]) => {
      const txs = {
        rootchainTxs,
        rootchainErc20Txs,
        rootchainInternalTxs,
        childchainTxs: pristineChildchainTxs
      }
      return mergeTxs(txs, address, tokens, standardExitBondSize)
    })

    return transactions
  } catch (err) {
    throw new Error(err)
  }
}

export const getExitTxs = async address => {
  const { unprocessed, processed } = await Transaction.allExits(address)
  return {
    unprocessed: unprocessed.map(u => u.transactionHash),
    processed: processed.map(p => p.transactionHash)
  }
}

const excludeSplittedTxs = txs => {
  return txs.filter(tx => {
    const inputAddresses = tx.inputs.map(input => input.owner)
    const outputAddresses = tx.outputs.map(output => output.owner)
    return new Set([...inputAddresses, ...outputAddresses]).size > 1
  })
}

const mergeTxs = async (txs, address, tokens, standardExitBondSize) => {
  const erc20Map = {}
  const internalTxMap = {}

  const {
    rootchainTxs,
    rootchainErc20Txs,
    rootchainInternalTxs,
    childchainTxs
  } = txs

  rootchainErc20Txs.forEach(tx => {
    if (erc20Map[tx.hash]) {
      // If we found duplicate transaction hash, meaning that this transaction contains multiple transfer.
      // Therefore, we need to aggregate all transacted values.
      erc20Map[tx.hash].value = BigNumber.plus(
        tx.value,
        erc20Map[tx.hash].value
      )
    } else {
      erc20Map[tx.hash] = tx
    }
  })

  rootchainInternalTxs.forEach(tx => {
    const { value, hash, isError } = tx

    // Failed transaction will already be included in the rootchainTxs
    if (isError === '1') return

    // Internal transactions can be contain an erc20 transaction which has multiple transfers.
    // Since it has already been calculated in the erc20Map, so we skip here.
    if (erc20Map[hash]) {
      erc20Map[hash] = {
        ...erc20Map[hash],
        exitBondFrom: tx.from,
        exitBondTo: tx.to,
        exitBond: BigNumber.plus(value, erc20Map[hash].exitBond || 0)
      }
      return
    }

    if (internalTxMap[hash]) {
      internalTxMap[hash].value = BigNumber.plus(
        value,
        internalTxMap[hash].value
      )
    } else {
      internalTxMap[hash] = tx
    }
  })

  const excludedInternalRootchainTxs = rootchainTxs.filter(
    tx => !internalTxMap[tx.hash]
  )

  // Contains every transactions except incoming erc20 transactions
  const mappedRootchainTxs = excludedInternalRootchainTxs.map(tx => {
    const erc20Tx = erc20Map[tx.hash]
    delete erc20Map[tx.hash]
    if (erc20Tx) {
      // Sent erc20 transactions
      return Mapper.mapRootchainErc20Tx(
        {
          ...erc20Tx,
          input: tx.input
        },
        address
      )
    } else {
      return Mapper.mapRootchainEthTx(tx, address, standardExitBondSize)
    }
  })

  // Contains successfully process exit transaction.
  const mappedInternalTxs = Object.keys(internalTxMap).map(hash => {
    const internalTx = internalTxMap[hash]
    return Mapper.mapRootchainEthTx(internalTx, address, standardExitBondSize)
  })

  // Contains all received erc20 transactions
  const mappedReceivedErc20Txs = Object.keys(erc20Map).map(key =>
    Mapper.mapRootchainErc20Tx(erc20Map[key], address)
  )

  const mappedChildchainTxs = childchainTxs.map(tx =>
    Mapper.mapChildchainTx(tx, tokens, address)
  )

  return [
    ...mappedRootchainTxs,
    ...mappedReceivedErc20Txs,
    ...mappedInternalTxs,
    ...mappedChildchainTxs
  ].sort((a, b) => b.timestamp - a.timestamp)
}
