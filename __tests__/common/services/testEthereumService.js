import { ethereumService } from 'common/services'
import Config from 'react-native-config'

const { TEST_ADDRESS } = Config

describe('Test Ethereum Service', () => {
  it('getEthBalance should return eth balance in ether unit', () => {
    return ethereumService.getEthBalance(TEST_ADDRESS).then(result => {
      console.log(result)
    })
  })
})
