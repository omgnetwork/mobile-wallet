import { useEffect, useState } from 'react'
import { BigNumber } from 'common/utils'

const useCheckBalanceAvailability = ({
  feeRate,
  feeToken,
  sendToken,
  sendAmount,
  estimatedFee
}) => {
  const [enoughBalance, setEnoughBalance] = useState(true)

  let minimumPaidAmount = 0
  useEffect(() => {
    function checkBalanceAvailability() {
      if (!estimatedFee) return

      if (feeRate.currency === sendToken.contractAddress) {
        minimumPaidAmount = BigNumber.plus(estimatedFee, sendAmount)
      } else {
        minimumPaidAmount = estimatedFee
      }

      const hasEnoughBalance = feeToken.balance >= minimumPaidAmount
      setEnoughBalance(hasEnoughBalance)
    }

    checkBalanceAvailability()
  }, [estimatedFee, feeRate, feeToken])

  return [enoughBalance, minimumPaidAmount]
}

export default useCheckBalanceAvailability
