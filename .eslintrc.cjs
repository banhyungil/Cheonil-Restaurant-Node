/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

/* eslint-env node */
module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                'no-unused-vars': 'warn',
            },
        },
    ],
    ignorePatterns: ['package*.json'],
}
