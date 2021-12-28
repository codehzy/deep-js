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
      {
        title: '欢迎学习',
        path: '/',
        collapsable: false, //折叠
        children: [{ title: '学前必读', path: '/' }]
      },
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
          { title: '函数的柯里化', path: '/handbook/09_func-curry' }
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
