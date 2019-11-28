module.exports = {
  presets: ['@babel/preset-env', 'module:metro-react-native-babel-preset'],
  env: {
    production: {
      // plugins: ['react-native-paper/babel']
      plugins: ['transform-remove-console']
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
    'babel-plugin-react-native-nodeify-hack'
  ]
}
