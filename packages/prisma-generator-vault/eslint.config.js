//const baseConfig = require("../../eslint.config.js")
const launchEslint = require("@launchware/eslint-config-node")

module.exports = [
  //...baseConfig,
  ...launchEslint.default.configs.recommended,
  {
    settings: {
      "files": ["**/*.{ts}"],
      "import/resolver": { typescript: { project: "./tsconfig.test.json" } },
    },
  },
  {
    files: ["test/**/*.{ts}", "**/*.test.{ts}"],
    languageOptions: { parserOptions: { project: "./tsconfig.test.json" } },
  },
]
