import { providerService, ethereumService } from 'common/services'
import { Token } from 'common/blockchain'
import { ethers } from 'ethers'

jest.mock('common/services/providerService.js')
jest.mock('common/blockchain/token.js')

const { getTransactionHistory } = providerService
const { fetchTokens } = Token

const mockProviderService = (method, resp) => {
  method.mockReturnValueOnce(Promise.resolve(resp))
}
const mockBlockchainToken = (method, resp) => {
  method.mockReturnValueOnce(Promise.resolve(resp))
}
const provider = ethers.getDefaultProvider('homestead')
const testAddress = '0x357829df016316d8DC40a54f0a8D84D53B0D76dD'

describe('Test Ethereum Service', () => {
  it('fetchAssets should return a list of assets', () => {
    const ETH = '0x0000000000000000000000000000000000000000'
    const DAI = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
    const OMG = '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07'
    const KCK = '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e'

    mockProviderService(getTransactionHistory, [
      { contractAddress: KCK },
      { contractAddress: DAI },
      { contractAddress: OMG }
    ])

    mockBlockchainToken(fetchTokens, {
      '0x0000000000000000000000000000000000000000': {
        tokenName: 'Ether',
        tokenSymbol: 'ETH',
        tokenDecimal: 18,
        price: 126.28,
        balance: '0.005',
        contractAddress: ETH
      },
      '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359': {
        tokenName: 'Dai Stablecoin v1.0',
        tokenSymbol: 'DAI',
        tokenDecimal: 18,
        price: 1,
        balance: '31.3131',
        contractAddress: DAI
      },
      '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07': {
        tokenName: 'OMGToken',
        tokenSymbol: 'OMG',
        tokenDecimal: 18,
        price: 1,
        balance: '0.0',
        contractAddress: OMG
      },
      '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e': {
        tokenName: 'KickToken',
        tokenSymbol: 'KCK',
        tokenDecimal: 8,
        price: 1,
        balance: '888888.0',
        contractAddress: KCK
      }
    })

    return ethereumService
      .fetchAssets(provider, testAddress, 0)
      .then(result => {
        expect(result).toStrictEqual({
          address: testAddress,
          rootchainAssets: [
            {
              tokenName: 'Ether',
              tokenSymbol: 'ETH',
              tokenDecimal: 18,
              price: 126.28,
              balance: '0.005',
              contractAddress: ETH
            },
            {
              tokenName: 'Dai Stablecoin v1.0',
              tokenSymbol: 'DAI',
              tokenDecimal: 18,
              price: 1,
              balance: '31.3131',
              contractAddress: DAI
            },
            {
              tokenName: 'KickToken',
              tokenSymbol: 'KCK',
              tokenDecimal: 8,
              price: 1,
              balance: '888888.0',
              contractAddress: KCK
            }
          ],
          updatedBlock: 0,
          updatedAt: result.updatedAt
        })
      })
  }, 10000)
})
