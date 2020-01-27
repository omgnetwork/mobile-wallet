import { providerService, ethereumService } from 'common/services'
import { Token } from 'common/blockchain'
import { ethers } from 'ethers'
import Config from '../../../config'

jest.mock('common/services/providerService.js')
jest.mock('common/blockchain/token.js')

const { TEST_TOKENS, TEST_WALLET_ADDRESS_FOR_TOKENS } = Config

const { getTransactionHistory } = providerService
const { fetchTokens } = Token

const mockProviderService = (method, resp) => {
  method.mockReturnValueOnce(Promise.resolve(resp))
}
const mockBlockchainToken = (method, resp) => {
  method.mockReturnValueOnce(Promise.resolve(resp))
}
const provider = ethers.getDefaultProvider('homestead')
const testAddress = TEST_WALLET_ADDRESS_FOR_TOKENS
const [ETH, DAI, OMG, KCK] = TEST_TOKENS

const [ETH_DETAIL, DAI_DETAIL, OMG_DETAIL, KCK_DETAIL] = [
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
    tokenName: 'OMGToken',
    tokenSymbol: 'OMG',
    tokenDecimal: 18,
    price: 1,
    balance: '0.0',
    contractAddress: OMG
  },
  {
    tokenName: 'KickToken',
    tokenSymbol: 'KCK',
    tokenDecimal: 8,
    price: 1,
    balance: '888888.0',
    contractAddress: KCK
  }
]

describe('Test Ethereum Services', () => {
  it('fetchAssets should return a list of assets', () => {
    mockProviderService(getTransactionHistory, [
      { contractAddress: KCK },
      { contractAddress: DAI },
      { contractAddress: OMG }
    ])

    mockBlockchainToken(fetchTokens, {
      '0x0000000000000000000000000000000000000000': ETH_DETAIL,
      '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359': DAI_DETAIL,
      '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07': OMG_DETAIL,
      '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e': KCK_DETAIL
    })

    return ethereumService
      .fetchAssets(provider, testAddress, 0)
      .then(result => {
        expect(result).toStrictEqual({
          address: testAddress,
          rootchainAssets: [ETH_DETAIL, DAI_DETAIL, KCK_DETAIL],
          updatedBlock: 0,
          updatedAt: result.updatedAt
        })
      })
  }, 10000)
})
