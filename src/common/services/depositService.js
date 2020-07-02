import axios from 'axios'
import JSONBigInt from 'json-bigint'
import Config from 'react-native-config'

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
  const deposits = await WatcherInfo.post('/deposit.all', {
    address,
    limit,
    page
  })
  return deposits.data.data
}
