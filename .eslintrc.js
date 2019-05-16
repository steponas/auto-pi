module.exports = {
  parser:  '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType:  'module',
    ecmaFeatures:  {
      jsx: true,  // Allows for the parsing of JSX
    },
  },
  rules: {
    'no-await-in-loop': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/indent': ['error', 2]
  },
  settings:  {
    react:  {
      version: 'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};