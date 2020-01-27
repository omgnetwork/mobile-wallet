import { BlockchainRenderer } from 'common/blockchain'

const FIVE_GWEI = '5000000000'

describe('Test BlockchainRenderer', () => {
  it('renderGasFee with zero flat fee should be equal to gasUsed * gasPrice in Ether unit', () => {
    const gasUsed = 21000
    const gasPrice = FIVE_GWEI

    const gasFee = BlockchainRenderer.renderGasFee(gasUsed, gasPrice)
    expect(gasFee).toBe('0.000105')
  })

  it('renderGasFee with non-zero flat fee should be equal to gasUsed * gasPrice + flatFee in Ether unit', () => {
    const gasUsed = 21000
    const gasPrice = FIVE_GWEI
    const flatFee = '14000000000000000' // 0.014 ETH

    const gasFee = BlockchainRenderer.renderGasFee(gasUsed, gasPrice, flatFee)
    expect(gasFee).toBe('0.014105')
  })

  it('renderGasFeeUsd should be equal to gasFee * usdPerEth', () => {
    const gasUsed = 21000
    const gasPrice = FIVE_GWEI
    const usdPerEth = 100.0
    const gasFeeUsd = BlockchainRenderer.renderGasFeeUsd(
      gasUsed,
      gasPrice,
      usdPerEth
    )
    expect(gasFeeUsd).toBe('0.010')
  })

  it('renderEthFromGwei should be equal to Gwei / 10^9', () => {
    const gwei = '20000000'
    const eth = BlockchainRenderer.renderEthFromGwei(gwei)
    expect(eth).toBe('0.02')
  })

  it('renderTokenBalance should have comma when balance more than or equal to 1000', () => {
    const tokenBalance = '5000'
    const formattedTokenBalance = BlockchainRenderer.renderTokenBalance(
      tokenBalance
    )
    expect(formattedTokenBalance).toBe('5,000')
  })

  it('renderTokenBalance should have decimal places less than given maxDecimal', () => {
    const tokenBalance = '2350.456'
    const maxDecimal = 2
    const formattedTokenBalance = BlockchainRenderer.renderTokenBalance(
      tokenBalance,
      maxDecimal
    )

    expect(formattedTokenBalance).toBe('2,350.45')
  })

  it('renderTokenPrice should be equal to tokenAmount * pricePerToken with 2 decimal places', () => {
    const tokenAmount = '120.345'
    const pricePerToken = '30.456'
    const tokenPrice = BlockchainRenderer.renderTokenPrice(
      tokenAmount,
      pricePerToken
    )
    expect(tokenPrice).toBe('3,665.22')
  })

  it('renderTotalPrice should be equal to firstPrice + secondPrice with 2 decimal places', () => {
    const firstPrice = '1000.256'
    const secondPrice = '1000.256'
    const totalPrice = BlockchainRenderer.renderTotalPrice(
      firstPrice,
      secondPrice
    )
    expect(totalPrice).toBe('2,000.51')
  })
})
