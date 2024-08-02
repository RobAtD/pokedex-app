import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    { ignores: ['**/*-polyfill.js', 'stylelint.config.js', '**/dist/*'] },
    { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
    {
        languageOptions: {
            globals: {
                $: 'writable',
                ...globals.browser,
            },
        },
    },
    pluginJs.configs.recommended,
    {
        rules: {
            camelcase: 'error',
        },
    },
];
