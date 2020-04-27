import { NativeModules, Platform } from 'react-native'

export const getLocale = () =>
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier
