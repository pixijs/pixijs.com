module.exports = {
    root: true,
    extends: ['@pixi/eslint-config', 'plugin:react/recommended', 'plugin:react/jsx-runtime'],
    plugins: ['react-hooks'],
    parserOptions: {
        project: ['tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    globals: {
        React: true,
        JSX: true,
    },
    settings: {
        jsdoc: {
            mode: 'typescript',
            tagNamePreference: {
                method: 'method',
                function: 'function',
                extends: 'extends',
                typeParam: 'typeParam',
                api: 'api',
            },
        },
    },
    ignorePatterns: ['build', 'node_modules'],
    rules: {
        'no-empty-function': 0,
        'no-prototype-builtins': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'spaced-comment': [1, 'always', { markers: ['/'] }],
        '@typescript-eslint/triple-slash-reference': [1, { path: 'always' }],
        '@typescript-eslint/consistent-type-imports': [1, { disallowTypeAnnotations: false }],
        '@typescript-eslint/no-parameter-properties': 1,
        '@typescript-eslint/type-annotation-spacing': 1,
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    },
};
