import { useState, useEffect } from 'react'
import { BigNumber } from 'common/utils'
import { BlockchainFormatter } from 'common/blockchain'
import { TransferHelper } from 'components/views/transfer'

const useEstimatedFee = ({
  feeRate,
  transferToken,
  ethToken,
  isEthereum,
  blockchainWallet,
  toAddress
}) => {
  const [estimatedFeeSymbol, setEstimatedFeeSymbol] = useState(null)
  const [estimatedFee, setEstimatedFee] = useState(null)
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState(null)
  const [estimatedTotal, setEstimatedTotal] = useState(null)
  const [estimatedTotalUsd, setEstimatedTotalUsd] = useState(null)

  const amount = transferToken.balance

  function updateState({ fee, feeSymbol = 'ETH', feeUsd, total, totalUsd }) {
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
        TransferHelper.TYPE_TRANSFER_ROOTCHAIN,
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

      updateState({ fee, feeUsd, total, totalUsd })
    }

    if (isEthereum) {
      calculateEthereumFee()
    } else {
      calculateOMGNetworkFee()
    }
  })

  return [
    estimatedFee,
    estimatedFeeSymbol,
    estimatedFeeUsd,
    estimatedTotal,
    estimatedTotalUsd
  ]
}

export default useEstimatedFee
