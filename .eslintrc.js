module.exports = {
  root: true,
  extends: [
    '@pixi/eslint-config',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
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
    'max-len': [1, { code: 80, tabWidth: 2 }],
    indent: [
      1,
      2,
      { SwitchCase: 1, VariableDeclarator: { var: 1, let: 1, const: 1 } },
    ],
    'no-empty-function': 0,
    'no-prototype-builtins': 0,
    'spaced-comment': [1, 'always', { markers: ['/'] }],
    '@typescript-eslint/triple-slash-reference': [1, { path: 'always' }],
    '@typescript-eslint/consistent-type-imports': [
      1,
      { disallowTypeAnnotations: false },
    ],
    '@typescript-eslint/no-parameter-properties': 1,
    '@typescript-eslint/type-annotation-spacing': 1,
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description' },
    ],
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/indent': [
          1,
          2,
          { SwitchCase: 1, VariableDeclarator: { var: 1, let: 1, const: 1 } },
        ],
      },
    },
  ],
};
