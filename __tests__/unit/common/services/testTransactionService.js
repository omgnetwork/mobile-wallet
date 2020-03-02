import { transactionService, providerService } from 'common/services'

const testAddress = '0x4522fb44C2aB359e76eCc75C22C9409690F12241'
let provider

describe('Test Transaction Service', () => {
  beforeAll(async () => {
    provider = await providerService.create('ropsten')
  })

  it('getTxs should return unique transaction hash', () => {
    return transactionService
      .getTxs(testAddress, provider, { page: 1, limit: 200 })
      .then(transactions => {
        const hashes = transactions.map(t => t.hash)
        const totalUniqueTxHashes = new Set(hashes).size
        const totalTransactions = transactions.length
        expect(totalTransactions).toBe(totalUniqueTxHashes)
      })
  }, 15000)
})
