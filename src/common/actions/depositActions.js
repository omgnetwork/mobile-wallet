import { createAsyncAction } from './actionCreators'
import { depositService } from 'common/services'

export const fetchDepositHistory = (provider, address, tokens, options) => {
  const asyncAction = async () => {
    const deposits = await depositService.getDeposits(address, options)
    return { deposits }
  }
  return createAsyncAction({
    operation: asyncAction,
    type: 'DEPOSITS/ALL'
  })
}
