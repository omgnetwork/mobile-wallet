import { Unit } from 'common/utils'

describe('Test Unit', () => {
  test('convert low to high', () => {
    expect(Unit.convertToString('1000000000000000000', 18, 0)).toBe('1')
    expect(Unit.convertToString('1', 18, 0)).toBe('0.000000000000000001')
    expect(Unit.convertToString('1', 9, 0)).toBe('0.000000001')
  })

  test('convert high to low', () => {
    expect(Unit.convertToString('9', 9, 18)).toBe('9000000000')
    expect(Unit.convertToString('1', 0, 18)).toBe('1000000000000000000')
    expect(Unit.convertToString('0.000001', 0, 9)).toBe('1000')
    expect(Unit.convertToString('0.000001', 0, 18)).toBe('1000000000000')
    expect(Unit.convertToString('23.45', 0, 18)).toBe('23450000000000000000')
    expect(Unit.convertToString('2.34', 9, 18)).toBe('2340000000')
  })

  test('convert european amount format', () => {
    expect(Unit.convertToString('1,25', 0, 18)).toBe('1250000000000000000')
    expect(Unit.convertToString('0,0000123', 0, 18)).toBe('12300000000000')
    expect(Unit.convertToString('325,35', 18, 0)).toBe('0.00000000000000032535')
    expect(Unit.convertToString('12300,95', 9, 0)).toBe('0.00001230095')
  })

  test('convert equal', () => {
    expect(Unit.convertToString('100', 18, 18)).toBe('100')
    expect(Unit.convertToString('100', 0, 0)).toBe('100')
  })
})
