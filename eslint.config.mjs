import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "tmp/**",
      "graphify-out/**",
      "scratch/**"
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-useless-escape": "warn",
      "no-empty": "warn",
      "no-cond-assign": "warn",
      "no-control-regex": "warn"
    }
  },
  eslintConfigPrettier
];
