module.exports = {
  root: true,
  parser:  '@typescript-eslint/parser',
  env: {
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType:  'module',
  },
  rules: {
    'no-await-in-loop': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
};
