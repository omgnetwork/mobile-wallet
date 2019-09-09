module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      // plugins: ['react-native-paper/babel']
    }
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.json']
      }
    ]
  ]
}
