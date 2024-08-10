module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@next/next/recommended',
    'prettier', // Prettier를 마지막에 추가하여 다른 규칙과 충돌을 방지합니다.
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // 필요에 따라 규칙을 추가하거나 수정할 수 있습니다.
    "prettier/prettier": "error",
    'react/react-in-jsx-scope': 'off', // Next.js에서는 React를 import할 필요가 없습니다.
    'react/prop-types': 'off', // TypeScript를 사용하므로 prop-types는 필요 없습니다.
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 함수 반환 타입을 명시적으로 지정하지 않아도 됩니다.
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수는 에러로 처리하되, '_'로 시작하는 변수는 무시합니다.
    'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log()는 경고, console.warn()과 console.error()는 허용합니다.
  },
};