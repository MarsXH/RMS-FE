module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'no-console': 'off',
    'curly': 0, // 允许单行if无{}
    'vue/max-attributes-per-line': [2, {
      'singleline': 10,
      'multiline': {
        'max': 5,
        'allowFirstLine': false
      }
    }], // 单行html属性不限制个数
    'vue/singleline-html-element-content-newline': 0, // 允许html标签在一行
    'vue/html-closing-bracket-newline': [1, {
      'singleline': 'never',
      'multiline': 'never'
    }], // html回标签换行
    'vue/attributes-order': [1, {
      'order': [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        'UNIQUE',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT'
      ]
    }], // html属性顺序
    'arrow-parens': ['error', 'as-needed'] // 单个参数箭头函数省略括号
  }
}
