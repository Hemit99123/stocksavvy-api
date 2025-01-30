import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config} */
export default {
  ignores: ["dist/*"],
  languageOptions: {
    globals: globals.browser,
  },
};
