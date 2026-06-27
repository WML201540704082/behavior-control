const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const name = "信息业务资源中台";

const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  publicPath: "/plugin/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    entry
      .add('@/mock')
      .end()
    config.plugins.delete('optimize-css')
  },
  devServer: {
    proxy: {
      '^/(api|idevelop-auth|idevelop-system|idevelop-plugin|//idevelop-auth|//idevelop-system|//idevelop-plugin)': {
        target: 'http://localhost:18084',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
          '^/idevelop-auth': '/idevelop-auth',
          '^/idevelop-system': '/idevelop-system',
          '^/idevelop-plugin': '/idevelop-plugin',
          '^//idevelop-auth': '/idevelop-auth',
          '^//idevelop-system': '/idevelop-system',
          '^//idevelop-plugin': '/idevelop-plugin'
        }
      }
    },
    watchOptions: {
      poll: false,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/*.log',
        '**/*.tmp',
        '**/*.swp',
        '**/* - 副本.vue'
      ],
      aggregateTimeout: 500
    }
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: "expanded" },
      },
    },
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    plugins: [
      new CompressionPlugin({
        test: /\.(js|html)?$/i,
        filename: "[path].gz[query]",
        algorithm: "gzip",
        minRatio: 0.8,
      }),
    ],
  }
}
