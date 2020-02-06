import React, { useState, useEffect } from 'react'
import { Image, View } from 'react-native'
import { ContractAddress } from 'common/constants'
import { OMGIdenticon, OMGEmpty } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Token } from 'common/blockchain'

const OMGTokenIcon = ({ token, theme, style, size }) => {
  const [isError, setIsError] = useState(false)
  const [isEth, setIsEth] = useState(
    token.contractAddress === ContractAddress.ETH_ADDRESS
  )
  const [contractAddressChecksum, setContractAddressChecksum] = useState(null)
  const [iconUri, setIconUri] = useState(null)

  useEffect(() => {
    const erc20Uri = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contractAddressChecksum}/logo.png`
    const ethUri = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png`
    const uri = isEth ? ethUri : erc20Uri
    setIconUri(uri)
  }, [token, isEth, contractAddressChecksum])

  useEffect(() => {
    const checksum = Token.getContractAddressChecksum(token.contractAddress)
    setContractAddressChecksum(checksum)
    if (token.contractAddress === ContractAddress.ETH_ADDRESS) {
      setIsEth(true)
      setIsError(false)
    } else {
      setIsEth(false)
    }
  }, [contractAddressChecksum, token])

  if (!contractAddressChecksum) {
    return <OMGEmpty loading={true} />
  }

  return isError ? (
    <OMGIdenticon
      hash={contractAddressChecksum}
      size={(style && style.width) || 40}
      style={[styles.iconFallback(theme), style]}
    />
  ) : (
    <View style={[styles.icon(theme), style]}>
      <Image
        style={styles.innerIcon(size)}
        source={{
          uri: iconUri
        }}
        onLoad={() => setIsError(false)}
        onError={() => {
          if (!isEth) setIsError(true)
        }}
      />
    </View>
  )
}

const styles = {
  iconFallback: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.white
  }),
  icon: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  innerIcon: size => ({
    width: size,
    height: size
  })
}

export default withTheme(OMGTokenIcon)
