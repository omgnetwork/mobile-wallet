import { useState, useEffect } from 'react'
import { BlockchainFormatter } from 'common/blockchain'
import { TransferHelper } from 'components/views/transfer'

const useEstimatedFee = ({
  feeRate,
  transferToken,
  ethToken,
  transactionType,
  blockchainWallet,
  toAddress
}) => {
  const [estimatedFeeSymbol, setEstimatedFeeSymbol] = useState(null)
  const [estimatedFee, setEstimatedFee] = useState(null)
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState(null)
  const [estimatedGasUsed, setEstimatedGasUsed] = useState(null)
  const [estimatedTotal, setEstimatedTotal] = useState(null)
  const [estimatedTotalUsd, setEstimatedTotalUsd] = useState(null)

  const amount = transferToken.balance

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
    function calculateOMGNetworkFee() {
      const feeSymbol = feeRate?.tokenSymbol ?? 'ETH'
      const fee = BlockchainFormatter.formatTokenBalanceFromSmallestUnit(
        feeRate.amount,
        feeRate.tokenDecimal
      )
      const feeUsd = BlockchainFormatter.formatTokenPrice(fee, feeRate.price)
      const total = BlockchainFormatter.formatTotalEthAmount(transferToken, fee)
      const totalUsd = BlockchainFormatter.formatTotalPrice(amount, feeUsd)

      updateState({ feeSymbol, fee, feeUsd, total, totalUsd })
    }

    async function calculateEthereumFee() {
      const gasUsed = await TransferHelper.getGasUsed(
        transactionType,
        transferToken,
        {
          wallet: blockchainWallet,
          to: toAddress,
          fee: feeRate
        }
      )
      const fee = BlockchainFormatter.formatGasFee(gasUsed, feeRate.amount)
      const feeUsd = BlockchainFormatter.formatTokenPrice(fee, ethToken.price)
      const totalUsd = BlockchainFormatter.formatTotalPrice(amount, feeUsd)
      const total = BlockchainFormatter.formatTotalEthAmount(transferToken, fee)

      updateState({ gasUsed, fee, feeUsd, total, totalUsd })
    }

    if (transactionType !== TransferHelper.TYPE_TRANSFER_CHILDCHAIN) {
      calculateEthereumFee()
    } else {
      calculateOMGNetworkFee()
    }
  }, [
    feeRate,
    transferToken,
    ethToken,
    transactionType,
    blockchainWallet,
    toAddress
  ])

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
