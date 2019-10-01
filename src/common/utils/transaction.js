import { transaction } from '@omisego/omg-js-util'
import { Plasma } from 'common/clients'
import { ABI } from 'common/utils'
import InputDataDecoder from 'ethereum-input-data-decoder'

const plasmaInputDecoder = new InputDataDecoder(ABI.plasmaAbi())

export const encodeMetadata = metadata => {
  return transaction.encodeMetadata(metadata)
}

export const decodeMetadata = encodedMetadata => {
  return transaction.decodeMetadata(encodedMetadata)
}

export const decodePlasmaInputMethod = input => {
  return plasmaInputDecoder.decodeData(input).method
}

export const isReceiveTx = (walletAddress, toAddress) => {
  if (!toAddress) return false
  return walletAddress.toLowerCase() === toAddress.toLowerCase()
}
