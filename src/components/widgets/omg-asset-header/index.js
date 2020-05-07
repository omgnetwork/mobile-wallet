import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGText, OMGFontIcon } from 'components/widgets'
import { IconEth, IconGo, Scan, ArrowDown, ArrowUp } from './assets'
import { Styles } from 'common/utils'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CircleButton = ({ children, theme, style, label }) => {
  const styles = createCircleBtnStyles(theme)
  return (
    <View style={style}>
      <TouchableOpacity style={[styles.btnContainer]}>
        {children}
      </TouchableOpacity>
      <OMGText weight='book' style={styles.label}>
        {label}
      </OMGText>
    </View>
  )
}

const createCircleBtnStyles = theme => ({
  btnContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.colors.white,
    borderWidth: 1
  },
  label: {
    marginTop: 8,
    color: theme.colors.white,
    fontSize: 12,
    textAlign: 'center'
  }
})

const OMGAssetHeader = ({
  theme,
  loading,
  amount,
  rootchain,
  network,
  onPressMenu,
  anchoredRef,
  style
}) => {
  const BlockchainIcon = rootchain ? IconEth : IconGo
  const styles = createStyles(theme)

  return (
    <View style={{ ...styles.container, ...style }} ref={anchoredRef}>
      <View style={styles.rowContainer}>
        <BlockchainIcon
          fill={theme.colors.white}
          width={rootchain ? 14 : 58}
          height={rootchain ? 23 : 18}
        />
        <OMGText style={styles.textNetwork}>{network}</OMGText>
        <OMGFontIcon
          size={Styles.getResponsiveSize(24, { small: 18, medium: 20 })}
          name='hamburger'
          onPress={onPressMenu}
          color={theme.colors.white}
        />
      </View>
      <View style={[styles.rowContainer, styles.rowMarginTop]}>
        <OMGText style={styles.balanceAmount} weight='bold'>
          <OMGText>$</OMGText> {amount}
        </OMGText>
        <TouchableOpacity style={styles.ovalButton}>
          <OMGText style={styles.ovalButtonText}>+</OMGText>
          <OMGText style={styles.ovalButtonText2}>-</OMGText>
        </TouchableOpacity>
      </View>
      <View
        style={[styles.rowContainer, styles.rowMarginTop, styles.rowCenter]}>
        <CircleButton theme={theme} label='Send'>
          <ArrowUp />
        </CircleButton>
        <CircleButton
          theme={theme}
          style={styles.rowItemMarginLeft}
          label='Receive'>
          <ArrowDown />
        </CircleButton>
        <CircleButton
          theme={theme}
          style={styles.rowItemMarginLeft}
          label='Scan'>
          <Scan />
        </CircleButton>
      </View>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
      paddingTop: Styles.getResponsiveSize(64, { small: 24, medium: 32 }),
      paddingBottom: Styles.getResponsiveSize(36, { small: 24, medium: 30 }),
      paddingHorizontal: 16
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
