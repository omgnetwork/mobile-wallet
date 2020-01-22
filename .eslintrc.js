module.exports = {
  root: true,
  plugins: ['jest'],
  overrides: [
    {
      files: ['**/tests/**/*.js']
    }
  ],
  extends: ['@react-native-community', 'plugin:prettier/recommended'],
  settings: {
    'import/resolver': {
      'babel-module': {}
    }
  }
}
