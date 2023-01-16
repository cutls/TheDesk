module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended", 
      "prettier", 
    ],
    plugins: [
        "@typescript-eslint"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      "sourceType": "module",
      "project": "./tsconfig.json",
      ecmaVersion: 2015
    },
    root: true, 
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "eqeqeq": ["error", "always"],
      "radix": "error",
      "no-extra-boolean-cast": "off"
    }
  }