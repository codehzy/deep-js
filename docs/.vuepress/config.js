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
      }
    ],
    // 开始多级标题展示
    subSideBar: 'auto'
  }
}
