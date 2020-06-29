import { useState, useEffect } from 'react'
import { BlockchainFormatter } from 'common/blockchain'
import { TransferHelper } from 'components/views/transfer'

const useEstimatedFee = ({ transactionType, sendTransactionParams }) => {
  const [estimatedFeeSymbol, setEstimatedFeeSymbol] = useState(null)
  const [estimatedFee, setEstimatedFee] = useState(null)
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState(null)
  const [estimatedGasUsed, setEstimatedGasUsed] = useState(null)
  const [error, setError] = useState(null)
  const [_estimatedTotal, setEstimatedTotal] = useState(null)
  const [_estimatedTotalUsd, setEstimatedTotalUsd] = useState(null)

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
      setError(error)
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
      const feeSymbol = gasToken.tokenSymbol
      const { token, amount } = sendTransactionParams.smallestUnitAmount
      const { gasPrice, gasToken } = sendTransactionParams.gasOptions

      try {
        const gasUsed = await TransferHelper.getGasUsed(
          transactionType,
          sendTransactionParams
        ).catch(err => console.log('test', err))
        const fee = BlockchainFormatter.formatGasFee(gasUsed, gasPrice)
        const feeUsd = BlockchainFormatter.formatTokenPrice(fee, gasToken.price)
        const total = BlockchainFormatter.formatTotalEthAmount(token, fee)
        const totalUsd = BlockchainFormatter.formatTotalPrice(amount, feeUsd)

        updateState({ gasUsed, feeSymbol, fee, feeUsd, total, totalUsd })
      } catch (e) {
        console.log(e)
        updateState({ error: e.message })
      }
    }

    try {
      calculateFee()
    } catch (er) {
      console.log(er)
    }
  }, [sendTransactionParams])

  return [
    estimatedFee,
    estimatedFeeSymbol,
    estimatedFeeUsd,
    estimatedGasUsed,
    error
  ]
}

export default useEstimatedFee
