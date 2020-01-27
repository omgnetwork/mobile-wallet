import { Formatter } from 'common/utils'

describe('Test Formatter', () => {
  it('formatUnits should be able to convert from the given unit to the biggest unit', () => {
    expect(Formatter.formatUnits('88888800000000', '8')).toBe('888888.0')
    expect(Formatter.formatUnits('88888800000000', 8)).toBe('888888.0')
    expect(Formatter.formatUnits('88888800000000', 'gwei')).toBe('88888.8')
  })
})
