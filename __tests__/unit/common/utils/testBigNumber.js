import { BigNumber } from 'common/utils'

describe('test BigNumber', () => {
  test('plus should not round up if the decimal places are less than or equal to 3', () => {
    expect(BigNumber.plus('0.1', '0.014')).toEqual('0.114')
    expect(BigNumber.plus('0', '0.014')).toEqual('0.014')
    expect(BigNumber.plus('0.01', '0.014')).toEqual('0.024')
    expect(BigNumber.plus('0.014', '0.014')).toEqual('0.028')
  })

  test('plus should round up if the decimal places are more than 3', () => {
    expect(BigNumber.plus('0.0001', '0.014')).toEqual('0.015')
    expect(BigNumber.plus('0.00000000001', '0.014')).toEqual('0.015')
  })
})
