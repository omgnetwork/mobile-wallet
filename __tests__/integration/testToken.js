import { Token } from 'common/blockchain'
import Config from '../config'

jest.mock('../config')

const { TEST_ERC20_TOKEN_CONTRACT_ADDRESS, TEST_TOKENS } = Config

const testWalletAddress = '0x4522fb44C2aB359e76eCc75C22C9409690F12241'
const [ETH, DAI, OMG, KCK, HYP] = TEST_TOKENS

describe('Test Token Util', () => {
  beforeAll(() => {
    Object.defineProperty(Config, 'WEB3_HTTP_PROVIDER', {
      get: jest.fn(() => 'https://mwproxy.mainnet.v1.omg.network/api'),
      set: jest.fn()
    })
    Object.defineProperty(Config, 'ETHEREUM_NETWORK', {
      get: jest.fn(() => 'mainnet'),
      set: jest.fn()
    })
  })

  test('Token.get should return {name, symbol, decimals, price, balance, contractAddress}', () => {
    const pendingDetails = Token.get(
      TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
      testWalletAddress
    )

    return Promise.all(pendingDetails).then(
      ([name, symbol, decimals, price, balance, contractAddress]) => {
        expect(name).toBeDefined()
        expect(symbol).toBeDefined()
        expect(decimals).toBeDefined()
        expect(price).toBeDefined()
        expect(balance).toBeDefined()
        expect(contractAddress).toBeDefined()
      }
    )
  }, 30000)

  test('Token.all should return [contractAddress: {tokenName, tokenSymbol, tokenDecimal, price, balance}]', () => {
    return Token.all([ETH, DAI, OMG, KCK, HYP], testWalletAddress).then(
      result => {
        expect(result).toStrictEqual({
          '0x0000000000000000000000000000000000000000': {
            tokenName: 'Ether',
            tokenSymbol: 'ETH',
            tokenDecimal: 18,
            price: result[ETH].price,
            balance: result[ETH].balance,
            contractAddress: ETH
          },
          '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359': {
            tokenName: 'Dai Stablecoin v1.0',
            tokenSymbol: 'DAI',
            tokenDecimal: 18,
            price: 1,
            balance: result[DAI].balance,
            contractAddress: DAI
          },
          '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07': {
            tokenName: 'OMGToken',
            tokenSymbol: 'OMG',
            tokenDecimal: 18,
            price: 1,
            balance: result[OMG].balance,
            contractAddress: OMG
          },
          '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e': {
            tokenName: 'KickToken',
            tokenSymbol: 'KICK',
            tokenDecimal: 8,
            price: 1,
            balance: result[KCK].balance,
            contractAddress: KCK
          },
          '0x2630997aab62fa1030a8b975e1aa2dc573b18a13': {
            tokenName: 'HYPE Token',
            tokenSymbol: 'HYPE',
            tokenDecimal: 18,
            price: 1,
            balance: result[HYP].balance,
            contractAddress: HYP
          }
        })
      }
    )
  }, 15000)
})
