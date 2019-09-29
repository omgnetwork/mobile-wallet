import { transaction } from '@omisego/omg-js-util'
import { Plasma } from 'common/clients'

export const encodeMetadata = metadata => {
  return transaction.encodeMetadata(metadata)
}

export const decodeMetadata = encodedMetadata => {
  return transaction.decodeMetadata(encodedMetadata)
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
