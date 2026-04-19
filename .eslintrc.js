module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-unused-vars": ["error", { vars: "all", args: "all", argsIgnorePattern: "^_" }],
    "no-unused-vars": ["error", { vars: "all", args: "all", ignoreRestSiblings: false }],
    quotes: [2, "double", { avoidEscape: true }], // specify whether double or single quotes should be used
    "quote-props": 0, // require quotes around object literal property names (off by default)
    semi: ["error", "always", {}],
  },
};
