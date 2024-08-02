import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {ignores: ["**/promise-polyfill.js"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
  {languageOptions: { globals: {
    $: "writable",
    ...globals.browser}}},
  pluginJs.configs.recommended,
  {rules: {
    "camelcase": "error"
  }},
];