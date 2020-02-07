import { Mapper } from 'common/utils'

describe('Test Mapper', () => {
  it('getFeeCurrency returns correct fee token when sending erc20 token and paid fee with eth', () => {
    const inputs = [
      { amount: '100', currency: '0x0' },
      { amount: '100', currency: '0x1' }
    ]
    const outputs = [
      { amount: '97', currency: '0x0' },
      { amount: '100', currency: '0x1' }
    ]

    expect(Mapper.getFeeCurrency({ inputs, outputs })).toBe('0x0')
  })

  it('getFeeCurrency returns correct fee token when sending eth token and also paid fee with eth', () => {
    const inputs = [{ amount: '100', currency: '0x0' }]
    const outputs = [
      { amount: '47', currency: '0x0' },
      { amount: '50', currency: '0x0' }
    ]

    expect(Mapper.getFeeCurrency({ inputs, outputs })).toBe('0x0')
  })

  it('getFeeAmount returns correct fee amount when sending erc20 token and paid fee with eth', () => {
    const inputs = [
      { amount: '100', currency: '0x0' },
      { amount: '100', currency: '0x1' }
    ]
    const outputs = [
      { amount: '97', currency: '0x0' },
      { amount: '100', currency: '0x1' }
    ]

    expect(Mapper.getFeeAmount({ inputs, outputs }, '0x0')).toBe('3')
  })

  it('getFeeAmount returns correct fee amount when sending eth token and also paid fee with eth', () => {
    const inputs = [{ amount: '100', currency: '0x0' }]
    const outputs = [
      { amount: '47', currency: '0x0' },
      { amount: '50', currency: '0x0' }
    ]

    expect(Mapper.getFeeAmount({ inputs, outputs }, '0x0')).toBe('3')
  })
})
