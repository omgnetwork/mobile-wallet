import React, { useState, useEffect } from 'react'
import { Image, View } from 'react-native'
import { ContractAddress } from 'common/constants'
import { OMGIdenticon, OMGEmpty } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Token } from 'common/blockchain'

const OMG = '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07'

const OMGTokenIcon = ({ token, theme, style, size }) => {
  const [isError, setIsError] = useState(false)
  const [isEth, setIsEth] = useState(
    token.contractAddress === ContractAddress.ETH_ADDRESS
  )
  const [contractAddressChecksum, setContractAddressChecksum] = useState(null)
  const [iconUri, setIconUri] = useState(null)

  useEffect(() => {
    const erc20Uri = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contractAddressChecksum}/logo.png?raw=true`
    const ethUri = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png?raw=true`
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

  const iconContainerSize = size + 8

  return isError ? (
    <OMGIdenticon
      hash={contractAddressChecksum}
      size={style?.width || iconContainerSize}
      style={[styles.iconFallback(theme, iconContainerSize), style]}
    />
  ) : (
    <View style={[styles.icon(theme, iconContainerSize), style]}>
      <Image
        style={styles.innerIcon(size)}
        source={
          contractAddressChecksum === OMG
            ? require('./assets/omg.png')
            : {
                uri: iconUri
              }
        }
        onLoad={() => {
          setIsError(false)
        }}
        onError={() => {
          if (!isEth) setIsError(true)
        }}
      />
    </View>
  )
}

const styles = {
  iconFallback: (theme, iconContainerSize) => ({
    width: iconContainerSize,
    height: iconContainerSize,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.white
  }),
  icon: (theme, iconContainerSize) => ({
    width: iconContainerSize,
    height: iconContainerSize,
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
