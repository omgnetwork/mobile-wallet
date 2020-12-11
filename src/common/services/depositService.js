import axios from 'axios'
import JSONBigInt from 'json-bigint'
import Config from 'react-native-config'

import { Datetime } from 'common/utils'
import { TransactionTypes, BlockchainNetworkType } from 'common/constants'

const JSONBigIntString = JSONBigInt({ storeAsString: true })

const WatcherInfo = axios.create({
  timeout: 10000,
  headers: { 'content-type': 'application/json' },
  baseURL: Config.WATCHER_URL,
  transformResponse: [data => JSONBigIntString.parse(data)]
})

export const getDeposits = async (
  address,
  options = { limit: 50, page: 1 }
) => {
  const { limit, page } = options

  const { data: response } = await WatcherInfo.post('/deposit.all', {
    address,
    limit,
    page
  })

  const { data: deposits } = response
  return deposits.map(normalise)
}

const normalise = deposit => {
  const { amount, currency } = deposit.txoutputs[0]

  return {
    contractAddress: currency,
    hash: deposit.root_chain_txhash,
    network: BlockchainNetworkType.TYPE_ETHEREUM_NETWORK,
    type: TransactionTypes.TYPE_DEPOSIT,
    value: amount,
    timestamp: Datetime.toTimestamp(deposit.inserted_at)
  }
}