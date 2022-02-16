module.exports = {
  title: '深入JavaScript',
  description: '深入JavaScript',
  theme: 'reco',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  base: '/deep-js/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },

      {
        text: 'JavaScript博客',
        items: [
          { text: 'Github', link: 'https://github.com/codehzy' },
          { text: '掘金', link: 'https://juejin.cn/user/1714893872178823' }
        ]
      }
    ],
    sidebar: [
      // {
      //   title: '欢迎学习',
      //   path: '/handbook/pre-read',
      //   collapsable: false, //折叠
      //   children: [{ title: '学前必读', path: '/handbook/pre-read' }]
      // },
      {
        title: 'JavaScript运行环境',
        path: '/handbook/01_browser-deep',
        collapsable: false, //折叠
        children: [
          { title: '浏览器工作原理', path: '/handbook/01_browser-deep' },
          { title: 'V8引擎工作原理', path: '/handbook/02_v8-work' },
          { title: 'JavaScript内存管理', path: '/handbook/03_js-memory' },
          { title: 'JavaScript事件循环', path: '/handbook/04_js_eventLoop' }
        ]
      },
      {
        title: 'JavaScript作用域和函数',
        path: '/handbook/05_know-scope',
        collapsable: false, //折叠
        children: [
          { title: '认识作用域', path: '/handbook/05_know-scope' },
          { title: '执行上下文', path: '/handbook/06_exec-context' },
          { title: '深入函数执行', path: '/handbook/07_deep-func-exec' },
          { title: '函数的this绑定', path: '/handbook/08_func-this-bind' },
          { title: '函数的柯里化', path: '/handbook/09_func-curry' },
          { title: 'with和eval', path: '/handbook/10_with_eval'}
        ]
      },
      {
        title: 'JavaScript面向对象(正在维护)',
        path: '/handbook/11_js_object',
        collapsable: false, //折叠
        children: [
          { title: 'JS面向对象', path: '/handbook/11_js_object' },
          { title: 'JS深入-原型到原型链', path: '/handbook/12_js_object_prototype_chain' },
          { title: 'ES6类', path: '/handbook/13_class_grammar' },
          { title: 'ES6知识点', path: '/handbook/14_es6_base' },
          { title: 'ES7知识点', path: '/handbook/15_es7_base' },
          { title: 'ES8知识点', path: '/handbook/16_es8_base' },
          { title: 'ES10知识点', path: '/handbook/17_es10_base' },
          { title: 'ES11知识点', path: '/handbook/18_es11_base' },
          { title: 'ES12知识点', path: '/handbook/19_es12_base' },
        ]
      }
    ],
    subSidebar: 'auto', //在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容,
    codeTheme: 'tomorrow'
  },
  plugins: [
    '@vuepress-reco/extract-code',
    {
      '@vuepress/medium-zoom': {
        selector: 'img.zoom-custom-imgs',
        // medium-zoom options here
        // See: https://github.com/francoischalifour/medium-zoom#options
        options: {
          margin: 16
        }
      }
    }
  ]
}
