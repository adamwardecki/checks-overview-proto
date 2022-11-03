module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  parserOptions: {
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    ecmaVersion: 'latest',
    requireConfigFile: false,
  },
  plugins: ['vue'],
  extends: [
    '@checkly/eslint-config',
    '@checkly/eslint-config/vue',
  ],
}
