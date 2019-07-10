module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        /* @xuhai start ESLint 配置 */
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'semi': ['error', 'always']
        /* @xuhai end */
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
