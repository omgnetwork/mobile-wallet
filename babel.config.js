module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console']
    },
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.json']
      }
    ],
    'babel-plugin-react-native-nodeify-hack',
    '@babel/plugin-proposal-optional-chaining'
  ]
}
