module.exports = {
  root: true,
  parser: 'babel-eslint',
  overrides: [
    {
      files: ['**/tests/**/*.js']
    }
  ],
  plugins: ['react', 'react-native', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': [2, { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    eqeqeq: ['error', 'always'],
    'prefer-const': ['error']
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
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"], 
      extends:["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      rules: {
        "@typescript-eslint/no-inferrable-types": [0]
      }
    }
  ]
}

