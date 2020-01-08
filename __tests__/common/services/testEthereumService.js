import { providerService, ethereumService } from 'common/services'
import Config from 'react-native-config'
import { ethers } from 'ethers'
const { TEST_ADDRESS, ETHERSCAN_NETWORK } = Config

jest.mock('common/services/providerService.js')

const provider = ethers.getDefaultProvider('homestead')
const { getTransactionHistory } = providerService
const mockProviderServiceGetTxHistory = resp => {
  getTransactionHistory.mockReturnValueOnce(Promise.resolve(resp))
}

describe('Test Ethereum Service', () => {
  it('getEthBalance should return eth balance in ether unit', () => {
    return ethereumService.getEthBalance(TEST_ADDRESS).then(result => {
      console.log(result)
    })
  })

  it('fetchAssets should return a list of assets', () => {
    mockProviderServiceGetTxHistory([
      { contractAddress: '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e' },
      { contractAddress: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' },
      { contractAddress: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07' },
      { contractAddress: '0x1c3bb10de15c31d5dbe48fbb7b87735d1b7d8c32' },
      { contractAddress: '0x2630997aab62fa1030a8b975e1aa2dc573b18a13' }
    ])
    return ethereumService
      .fetchAssets(provider, '0x357829df016316d8DC40a54f0a8D84D53B0D76dD', 0)
      .then(result => {
        console.log(result)
      })
  })
})
