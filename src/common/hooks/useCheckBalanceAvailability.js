import { useEffect, useState } from 'react'
import { BigNumber } from 'common/utils'

const useCheckBalanceAvailability = ({
  sendTransactionParams,
  estimatedFee
}) => {
  const [enoughBalance, setEnoughBalance] = useState(false)
  const [minimumPaidAmount, setMinimumPaidAmount] = useState(0)

  useEffect(() => {
    function checkBalanceAvailability() {
      if (!estimatedFee) return
      if (!sendTransactionParams) return
      const { smallestUnitAmount, gasOptions } = sendTransactionParams

      let minimumAmount = 0

      const { gasToken } = gasOptions
      const { token, amount } = smallestUnitAmount
      if (gasToken.currency === token.contractAddress) {
        minimumAmount = BigNumber.plus(estimatedFee, amount)
      } else {
        minimumAmount = estimatedFee
      }

      const hasEnoughBalance =
        BigNumber.compare(gasToken.balance, minimumAmount) >= 0

      setEnoughBalance(hasEnoughBalance)
      setMinimumPaidAmount(minimumAmount)
    }

    checkBalanceAvailability()
  }, [estimatedFee, sendTransactionParams])

  return [enoughBalance, minimumPaidAmount]
}

export default useCheckBalanceAvailability
