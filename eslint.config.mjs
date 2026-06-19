import globals from "globals";
import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
      ecmaVersion: "latest",
    },
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      // "@stylistic/js/indent": ["error", 2],
      // "@stylistic/js/linebreak-style": ["error", "unix"],
      // "@stylistic/js/quotes": ["error", "single"],
      // "@stylistic/js/semi": ["error", "never"],

      /* --- Style Consistency --- */
      "@stylistic/js/semi": ["error", "never"],
      "@stylistic/js/quotes": ["error", "single", { avoidEscape: true }],
      "@stylistic/js/indent": ["error", 2, { SwitchCase: 1 }],
      "@stylistic/js/linebreak-style":['error','unix'],
      "@stylistic/js/space-before-blocks": ["error", "always"],
      "@stylistic/js/keyword-spacing": ["error", { before: true, after: true }],
      "@stylistic/js/object-curly-spacing": ["error", "always"],
      "@stylistic/js/array-bracket-spacing": ["error", "never"],
      "@stylistic/js/arrow-spacing": ["error", { before: true, after: true }],
      "@stylistic/js/no-multi-spaces": "error",
      "@stylistic/js/eol-last": ["error", "always"],
      "@stylistic/js/no-trailing-spaces": "error",

      /* --- Code Quality --- */
      "no-unused-vars": ["error", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
      "no-console": "off",
      "no-debugger": "error",
      "eqeqeq": ["error", "always"],
      // "curly": ["error", "all"],

      /* --- Tightness & Readability --- */
      "max-lines": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
      "max-params": ["warn", 4],
      "max-depth": ["warn", 3],
      "max-nested-callbacks": ["warn", 3],
      "complexity": ["warn", 8],

      

     
    },
  },
  {
    ignores:['dist/**'],
  }
];
