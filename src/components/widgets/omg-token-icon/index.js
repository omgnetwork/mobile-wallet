import React, { useState } from 'react'
import { Image } from 'react-native'
import { OMGIdenticon } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGTokenIcon = ({ token, theme, style, size }) => {
  const [isError, setIsError] = useState(false)

  return isError ? (
    <OMGIdenticon
      hash={token.contractAddress}
      size={size || 40}
      style={[styles.icon(theme), style]}
    />
  ) : (
    <Image
      style={[styles.icon(theme), style]}
      source={{
        uri: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.contractAddress}/logo.png`
      }}
      onError={() => setIsError(true)}
    />
  )
}

const styles = {
  icon: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderColor: theme.colors.black4,
    borderWidth: 0.5
  })
}

export default withTheme(OMGTokenIcon)
