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

export const getDirection = (address, metadata) => {
  const defaultMetadata = {
    from: address,
    to: address
  }
  if (metadata === Plasma.transaction.NULL_METADATA) {
    return defaultMetadata
  } else {
    const decodedMetadata = decodeMetadata(metadata)
    const isMobileWalletMetadata = decodedMetadata.indexOf('from') === 0

    if (isMobileWalletMetadata) {
      const from = decodedMetadata.split('&')[0].split(':')[1]
      const to = decodedMetadata.split('&')[1].split(':')[1]

      return {
        from,
        to
      }
    } else {
      return defaultMetadata
    }
  }
}
