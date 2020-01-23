import { Token } from 'common/blockchain'
import { ethers } from 'ethers'
import Config from '../../../config'

const {
  ETHERSCAN_NETWORK,
  TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
  TEST_WALLET_ADDRESS_FOR_TOKENS,
  TEST_TOKENS
} = Config

const provider = ethers.getDefaultProvider('homestead')
const testProvider = ethers.getDefaultProvider(ETHERSCAN_NETWORK)

const testWalletAddress = TEST_WALLET_ADDRESS_FOR_TOKENS
const [ETH, DAI, OMG, KCK, HYP] = TEST_TOKENS

describe('Test Token Util', () => {
  it('fetchTokenDetail should return {name, symbol, decimals, price, balance, contractAddress}', () => {
    const pendingDetails = Token.fetchTokenDetail(
      testProvider,
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
  }, 15000)

  it('fetchTokens should return [contractAddress: {tokenName, tokenSymbol, tokenDecimal, price, balance}]', () => {
    return Token.fetchTokens(
      provider,
      [ETH, DAI, OMG, KCK, HYP],
      testWalletAddress
    ).then(result => {
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
    })
  }, 15000)
})
