import * as ReactNative from 'react-native'

jest.doMock('react-native', () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      Platform: {
        ...ReactNative.Platform,
        OS: 'ios',
        isTesting: true
      },
      // Mock a native module
      NativeModules: {
        ...ReactNative.NativeModules,
        SettingsManager: {
          settings: {
            AppleLocale: 'en_US'
          }
        }
      }
    },
    ReactNative
  )
})
