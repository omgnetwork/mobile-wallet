module.exports = {
  root: true,
  parser: 'babel-eslint',
  overrides: [
    {
      files: ['**/tests/**/*.js']
    }
  ],
  plugins: ['react', 'react-native'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
    // 'plugin:prettier/recommended'
  ],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': [2, { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
  },
  env: {
    jest: true,
    node: true,
    es6: true,
    browser: true
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    __DEV__: true
  }
}
