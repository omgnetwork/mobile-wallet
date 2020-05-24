import ABIDecoder from 'abi-decoder'

export const init = (abis = []) => {
  abis.forEach(abi => {
    ABIDecoder.addABI(abi)
  })
}

export const get = () => ABIDecoder
