import { BlockchainFormatter } from 'common/blockchain'

const FIVE_GWEI = '5000000000'

describe('Test BlockchainFormatter', () => {
  it('formatUnits should be able to convert from the given unit to the biggest unit', () => {
    expect(BlockchainFormatter.formatUnits('88888800000000', '8')).toBe(
      '888888.0'
    )
    expect(BlockchainFormatter.formatUnits('88888800000000', 8)).toBe(
      '888888.0'
    )
    expect(BlockchainFormatter.formatUnits('88888800000000', 'gwei')).toBe(
      '88888.8'
    )
  })
  it('formatGasFee with zero flat fee should be equal to gasUsed * gasPrice in Ether unit', () => {
    const gasUsed = 21000
    const gasPrice = FIVE_GWEI

    const gasFee = BlockchainFormatter.formatGasFee(gasUsed, gasPrice)
    expect(gasFee).toBe('0.000105')
  })

  it('formatGasFee with non-zero flat fee should be equal to gasUsed * gasPrice + flatFee in Ether unit', () => {
    const gasUsed = 21000
    const gasPrice = FIVE_GWEI
    const flatFee = '14000000000000000' // 0.014 ETH

    const gasFee = BlockchainFormatter.formatGasFee(gasUsed, gasPrice, flatFee)
    expect(gasFee).toBe('0.014105')
  })

  it('formatGasFeeUsd should be equal to gasFee * usdPerEth', () => {
    const gasUsed = 21000
    const gasPrice = FIVE_GWEI
    const usdPerEth = 100.0
    const gasFeeUsd = BlockchainFormatter.formatGasFeeUsd(
      gasUsed,
      gasPrice,
      usdPerEth
    )
    expect(gasFeeUsd).toBe('0.01')
  })

  it('formatEthFromWei should be equal to Wei / 10^18', () => {
    const wei = '5000000000'
    const eth = BlockchainFormatter.formatEthFromWei(wei)
    expect(eth).toBe('0.000000005')
  })

  it('formatTokenBalance should have comma when balance more than or equal to 1000', () => {
    const tokenBalance = '5000'
    const formattedTokenBalance = BlockchainFormatter.formatTokenBalance(
      tokenBalance
    )
    expect(formattedTokenBalance).toBe('5,000')
  })

  it('formatTokenBalance should have decimal places less than given maxDecimal', () => {
    const tokenBalance = '2350.456'
    const maxDecimal = 2
    const formattedTokenBalance = BlockchainFormatter.formatTokenBalance(
      tokenBalance,
      maxDecimal
    )

    expect(formattedTokenBalance).toBe('2,350.45')
  })

  it('formatTokenPrice should be equal to tokenAmount * pricePerToken with 2 decimal places', () => {
    const tokenAmount = '120.345'
    const pricePerToken = '30.456'
    const tokenPrice = BlockchainFormatter.formatTokenPrice(
      tokenAmount,
      pricePerToken
    )
    expect(tokenPrice).toBe('3,665.22')
  })

  it('formatTotalPrice should be equal to firstPrice + secondPrice with 2 decimal places', () => {
    const firstPrice = '1000.256'
    const secondPrice = '1000.256'
    const totalPrice = BlockchainFormatter.formatTotalPrice(
      firstPrice,
      secondPrice
    )
    expect(totalPrice).toBe('2,000.51')
  })
})
