import { useState, useEffect } from 'react'
import { BlockchainFormatter } from 'common/blockchain'
import { TransferHelper } from 'components/views/transfer'

const useEstimatedFee = ({ transactionType, sendTransactionParams }) => {
  const [estimatedFeeSymbol, setEstimatedFeeSymbol] = useState()
  const [estimatedFee, setEstimatedFee] = useState()
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState()
  const [estimatedGasUsed, setEstimatedGasUsed] = useState()
  const [error, setError] = useState()
  const [_estimatedTotal, setEstimatedTotal] = useState()
  const [_estimatedTotalUsd, setEstimatedTotalUsd] = useState()

  function updateState({
    gasUsed = 0,
    fee,
    feeSymbol = 'ETH',
    feeUsd,
    total,
    totalUsd,
    error
  }) {
    if (error) {
      setError(error.message)
    } else {
      setEstimatedGasUsed(gasUsed)
      setEstimatedFeeSymbol(feeSymbol)
      setEstimatedFee(fee)
      setEstimatedFeeUsd(feeUsd)
      setEstimatedTotal(total)
      setEstimatedTotalUsd(totalUsd)
    }
  }

  useEffect(() => {
    async function calculateFee() {
      const { token, amount } = sendTransactionParams.smallestUnitAmount
      const { gasPrice, gasToken } = sendTransactionParams.gasOptions
      const feeSymbol = gasToken.tokenSymbol

      const gasUsed = await TransferHelper.getGasUsed(
        transactionType,
        sendTransactionParams
      ).catch(err => updateState({ error: err }))

      if (gasUsed) {
        const fee = BlockchainFormatter.formatGasFee(gasUsed, gasPrice)
        const feeUsd = BlockchainFormatter.formatTokenPrice(fee, gasToken.price)
        const total = BlockchainFormatter.formatTotalEthAmount(token, fee)
        const totalUsd = BlockchainFormatter.formatTotalPrice(amount, feeUsd)

        updateState({ gasUsed, feeSymbol, fee, feeUsd, total, totalUsd })
      }
    }

    calculateFee()
  }, [
    updateState,
    transactionType,
    sendTransactionParams.smallestUnitAmount,
    sendTransactionParams.gasOptions
  ])

  return [
    estimatedFee,
    estimatedFeeSymbol,
    estimatedFeeUsd,
    estimatedGasUsed,
    error
  ]
}

export default useEstimatedFee
