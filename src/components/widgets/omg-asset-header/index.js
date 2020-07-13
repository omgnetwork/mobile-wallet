import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGFontIcon } from 'components/widgets'
import CircleButton from './CircleButton'
import { IconEth, IconGo, Scan, ArrowDown, ArrowUp } from './assets'
import { Styles } from 'common/utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BlockchainNetworkType } from 'common/constants'

const OMGAssetHeader = ({
  theme,
  type,
  network,
  onPressSidebarMenu,
  anchoredRef,
  disableSend,
  onPressMenu,
  onPressSend,
  onPressReceive,
  onPressScan,
  style
}) => {
  const isRootchain = BlockchainNetworkType.TYPE_ETHEREUM_NETWORK === type
  const BlockchainIcon = isRootchain ? IconEth : IconGo
  const styles = createStyles(theme, isRootchain)

  return (
    <View style={{ ...styles.container, ...style }} ref={anchoredRef}>
      <View style={styles.rowContainer}>
        <View style={styles.iconNetwork}>
          <BlockchainIcon
            fill={theme.colors.white}
            width={isRootchain ? 14 : 58}
            height={isRootchain ? 23 : 18}
          />
          {isRootchain && (
            <OMGText style={styles.iconTextNetwork} weight='book'>
              Ethereum{'\n'}Network
            </OMGText>
          )}
        </View>
        <OMGText style={styles.textNetwork}>{network}</OMGText>
        <OMGFontIcon
          size={Styles.getResponsiveSize(24, { small: 18, medium: 20 })}
          name='hamburger'
          onPress={onPressSidebarMenu}
          color={theme.colors.white}
        />
      </View>
      <View
        style={[styles.rowContainer, styles.rowMarginTop, styles.rowCenter]}>
        <View style={styles.buttonsGroup}>
          <CircleButton
            theme={theme}
            label='Send'
            onPress={onPressSend}
            disable={disableSend}>
            <ArrowUp />
          </CircleButton>
          <CircleButton
            style={styles.rowItemMarginLeft}
            onPress={onPressReceive}
            label='Receive'>
            <ArrowDown />
          </CircleButton>
          <CircleButton
            style={styles.rowItemMarginLeft}
            onPress={onPressScan}
            disable={disableSend}
            label='Scan'>
            <Scan />
          </CircleButton>
        </View>
        <TouchableOpacity style={styles.ovalButton} onPress={onPressMenu}>
          <OMGText style={styles.ovalButtonText}>+</OMGText>
          <OMGText style={styles.ovalButtonText2}>-</OMGText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const createStyles = (theme, isRootchain) =>
  StyleSheet.create({
    container: {
      backgroundColor: isRootchain ? theme.colors.gray9 : theme.colors.primary,
      paddingTop: 16,
      paddingBottom: Styles.getResponsiveSize(36, { small: 24, medium: 30 }),
      paddingHorizontal: 16
    },
    iconNetwork: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    iconTextNetwork: {
      marginLeft: 8,
      fontSize: 10,
      letterSpacing: 0.7,
      color: theme.colors.white
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    textNetwork: {
      flex: 1,
      textAlign: 'center',
      marginLeft: -36,
      fontSize: 12,
      color: theme.colors.white
    },
    balanceAmount: {
      color: theme.colors.white,
      letterSpacing: -0.48,
      lineHeight: 48,
      fontSize: Styles.getResponsiveSize(40, { small: 32, medium: 40 })
    },
    buttonsGroup: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    ovalButtonText: {
      color: theme.colors.white,
      fontSize: 20
    },
    ovalButtonText2: {
      color: theme.colors.white,
      fontSize: 20,
      marginTop: -12
    },
    rowMarginTop: {
      marginTop: Styles.getResponsiveSize(40, { small: 24, medium: 32 })
    },
    rowCenter: {
      justifyContent: 'center',
      marginLeft: 30
    },
    rowItemMarginLeft: {
      marginLeft: 30
    },
    ovalButton: {
      backgroundColor: theme.colors.black5,
      borderRadius: 16,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginBottom: 12,
      marginLeft: 'auto'
    }
  })

export default withTheme(OMGAssetHeader)
