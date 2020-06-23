import { useState, useEffect } from 'react'
import { BlockchainFormatter } from 'common/blockchain'
import { TransferHelper } from 'components/views/transfer'

const useEstimatedFee = ({ transactionType, sendTransactionParams }) => {
  const [estimatedFeeSymbol, setEstimatedFeeSymbol] = useState(null)
  const [estimatedFee, setEstimatedFee] = useState(null)
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState(null)
  const [estimatedGasUsed, setEstimatedGasUsed] = useState(null)
  const [estimatedTotal, setEstimatedTotal] = useState(null)
  const [estimatedTotalUsd, setEstimatedTotalUsd] = useState(null)

  function updateState({
    gasUsed = 0,
    fee,
    feeSymbol = 'ETH',
    feeUsd,
    total,
    totalUsd
  }) {
    setEstimatedGasUsed(gasUsed)
    setEstimatedFeeSymbol(feeSymbol)
    setEstimatedFee(fee)
    setEstimatedFeeUsd(feeUsd)
    setEstimatedTotal(total)
    setEstimatedTotalUsd(totalUsd)
  }

  useEffect(() => {
    async function calculateFee() {
      try {
        const gasUsed = await TransferHelper.getGasUsed(
          transactionType,
          sendTransactionParams
        )
        const { token, amount } = sendTransactionParams.smallestUnitAmount
        const { gasPrice, gasToken } = sendTransactionParams.gasOptions
        const feeSymbol = gasToken.tokenSymbol
        const fee = BlockchainFormatter.formatGasFee(gasUsed, gasPrice)
        const feeUsd = BlockchainFormatter.formatTokenPrice(fee, token.price)
        const total = BlockchainFormatter.formatTotalEthAmount(token, fee)
        const totalUsd = BlockchainFormatter.formatTotalPrice(amount, feeUsd)

        updateState({ gasUsed, feeSymbol, fee, feeUsd, total, totalUsd })
      } catch (e) {
        console.log(e)
      }
    }

    calculateFee()
  }, [sendTransactionParams])

  return [
    estimatedFee,
    estimatedFeeSymbol,
    estimatedFeeUsd,
    estimatedGasUsed,
    estimatedTotal,
    estimatedTotalUsd
  ]
}

export default useEstimatedFee
