import { Gas } from 'common/constants'

export default [
  {
    id: '1',
    speed: 'Fast',
    estimateTime: 'Less than 30 seconds',
    amount: Gas.HIGH_TRANSFER_GAS_PRICE,
    displayAmount: '24',
    symbol: 'Gwei',
    price: '0.047'
  },
  {
    id: '2',
    speed: 'Standard',
    estimateTime: 'Less than 3 minutes',
    amount: Gas.MEDIUM_TRANSFER_GAS_PRICE,
    displayAmount: '10',
    symbol: 'Gwei',
    price: '0.019'
  },
  {
    id: '3',
    speed: 'Safe low',
    estimateTime: 'Less than 10 minutes',
    amount: Gas.LOW_TRANSFER_GAS_PRICE,
    displayAmount: '5',
    symbol: 'Gwei',
    price: '0.007'
  }
]
