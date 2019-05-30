module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    PDFTron: true,
    localforage: true
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-var': 0,
    'prefer-arrow-callback': 0,
    'func-names': 0,
    'space-before-function-paren': 0,
    'no-param-reassign': 0
  },
};
