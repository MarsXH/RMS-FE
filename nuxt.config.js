
const isProd = process.env.NODE_ENV === 'production'
console.log('Is current mode production?', isProd)

const apiUrl = isProd
  ? 'http://rms-backend:8899' : 'http://localhost:8899'
  // : process.env.BAK_URL || 'http://10.99.104.251:3001'
// const apiUrl = 'http://localhost:8899'

const proxy = {
  '/api/v1': { target: apiUrl, pathRewrite: {'^/api/v1': ''} }
}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'CRBEG-RMS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/font/iconfont.css',
    '~/assets/style/common.css',
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/element-ui.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/proxy',
    '@nuxtjs/axios'
  ],
  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0' // default: localhost,
  },
  proxy,
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules|plugins)/
      //   })
      // }
    }
  }
}
