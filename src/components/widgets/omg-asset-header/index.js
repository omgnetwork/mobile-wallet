import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGText, OMGFontIcon } from 'components/widgets'
import { IconEth, IconGo, Scan, ArrowDown, ArrowUp } from './assets'
import { Styles } from 'common/utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BlockchainNetworkType } from 'common/constants'

const CircleButton = ({ children, theme, style, label, onPress, disable }) => {
  const styles = createCircleBtnStyles(theme, disable)
  return (
    <View style={style}>
      <TouchableOpacity
        style={[styles.btnContainer]}
        onPress={onPress}
        disabled={disable}>
        {children}
      </TouchableOpacity>
      <OMGText weight='book' style={styles.label}>
        {label}
      </OMGText>
    </View>
  )
}

const createCircleBtnStyles = (theme, disable) => ({
  btnContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disable ? 0.4 : 1.0,
    borderColor: theme.colors.white,
    borderWidth: 1
  },
  label: {
    marginTop: 8,
    color: theme.colors.white,
    fontSize: 12,
    opacity: disable ? 0.4 : 1.0,
    textAlign: 'center'
  }
})

const OMGAssetHeader = ({
  theme,
  loading,
  amount,
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
      <View style={[styles.rowContainer, styles.rowMarginTop]}>
        <OMGText style={styles.balanceAmount} weight='bold'>
          <OMGText>$</OMGText> {amount}
        </OMGText>
        <TouchableOpacity style={styles.ovalButton} onPress={onPressMenu}>
          <OMGText style={styles.ovalButtonText}>+</OMGText>
          <OMGText style={styles.ovalButtonText2}>-</OMGText>
        </TouchableOpacity>
      </View>
      <View
        style={[styles.rowContainer, styles.rowMarginTop, styles.rowCenter]}>
        <CircleButton
          theme={theme}
          label='Send'
          onPress={onPressSend}
          disable={disableSend}>
          <ArrowUp />
        </CircleButton>
        <CircleButton
          theme={theme}
          style={styles.rowItemMarginLeft}
          onPress={onPressReceive}
          label='Receive'>
          <ArrowDown />
        </CircleButton>
        <CircleButton
          theme={theme}
          style={styles.rowItemMarginLeft}
          onPress={onPressScan}
          label='Scan'>
          <Scan />
        </CircleButton>
      </View>
    </View>
  )
}

const createStyles = (theme, isRootchain) =>
  StyleSheet.create({
    container: {
      backgroundColor: isRootchain ? theme.colors.gray9 : theme.colors.primary,
      paddingTop: Styles.getResponsiveSize(64, { small: 24, medium: 32 }),
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
      justifyContent: 'space-between',
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
      justifyContent: 'center'
    },
    rowItemMarginLeft: {
      marginLeft: 30
    },
    ovalButton: {
      backgroundColor: theme.colors.black5,
      borderRadius: 16,
      paddingHorizontal: 8,
      paddingVertical: 3,
      justifyContent: 'center',
      flexDirection: 'column'
    }
  })

export default withTheme(OMGAssetHeader)
