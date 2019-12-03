import { BlockchainCalculator } from '../../src/common/blockchain'
it('calculate plasma fee usd from given tokenPrice and gasPrice', () => {
  const tokenPrice = 1
  const gasPrice = 1000000000 // 1 Gwei
  const plasmaFeeUsd = BlockchainCalculator.calculatePlasmaFeeUSD(
    tokenPrice,
    gasPrice
  )

  expect(plasmaFeeUsd).toEqual('1000000000')
})
