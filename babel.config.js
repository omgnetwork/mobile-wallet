module.exports = {
  presets: ['@babel/preset-env', 'module:metro-react-native-babel-preset'],
  env: {
    production: {
      // plugins: ['react-native-paper/babel']
      plugins: ['transform-remove-console', 'transform-es2015-modules-commonjs']
    },
    test: {
      // plugins: ['react-native-paper/babel']
      plugins: ['transform-es2015-modules-commonjs'],
      presets: ['react-native', ['@babel/preset-env']]
    },
    development: {
      plugins: ['transform-es2015-modules-commonjs']
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
