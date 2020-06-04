import { NativeModules, Platform } from 'react-native'

const defaultLocale = 'en_US'

export const getLocale = () => {
  if (Platform.OS === 'ios') {
    const locale = NativeModules.SettingsManager.settings.AppleLocale
    if (locale) {
      return locale.split('@')[0]
    } else {
      const deviceLanguage =
        NativeModules.SettingsManager.settings.AppleLanguages[0]

      if (!deviceLanguage) {
        return defaultLocale
      }
      return deviceLanguage
    }
  } else {
    return NativeModules.I18nManager.localeIdentifier
  }
}
