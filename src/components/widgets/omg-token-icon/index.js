import React, { useState } from 'react'
import { Image, View } from 'react-native'
import { ContractAddress } from 'common/constants'
import { OMGIdenticon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Token } from 'common/blockchain'

const OMGTokenIcon = ({ token, theme, style, size }) => {
  const [isError, setIsError] = useState(false)
  const contractAddressChecksum = Token.getContractAddressChecksum(
    token.contractAddress
  )
  const isEth = token.contractAddress === ContractAddress.ETH_ADDRESS
  const iconUri = isEth
    ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png`
    : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contractAddressChecksum}/logo.png`
  return isError ? (
    <OMGIdenticon
      hash={contractAddressChecksum}
      size={size || 40}
      style={[styles.iconFallback(theme), style]}
    />
  ) : (
    <View style={[styles.icon(theme), style]}>
      <Image
        style={styles.innerIcon(size)}
        source={{
          uri: iconUri
        }}
        onError={() => setIsError(true)}
      />
    </View>
  )
}

const styles = {
  iconFallback: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderColor: theme.colors.black4,
    borderWidth: 0.5
  }),
  icon: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderColor: theme.colors.black4,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  innerIcon: size => ({
    width: size,
    height: size
  })
}

export default withTheme(OMGTokenIcon)
