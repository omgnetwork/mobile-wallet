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
  const [minimumPaidAmount, setMinimumPaidAmount] = useState(0)

  useEffect(() => {
    function checkBalanceAvailability() {
      if (!estimatedFee) return

      let minimumAmount = 0
      if (feeRate.currency === sendToken.contractAddress) {
        minimumAmount = BigNumber.plus(estimatedFee, sendAmount)
      } else {
        minimumAmount = estimatedFee
      }

      const hasEnoughBalance =
        BigNumber.compare(feeToken.balance, minimumAmount) >= 0

      setEnoughBalance(hasEnoughBalance)
      setMinimumPaidAmount(minimumAmount)
    }

    checkBalanceAvailability()
  }, [estimatedFee, feeRate, feeToken])

  return [enoughBalance, minimumPaidAmount]
}

export default useCheckBalanceAvailability
