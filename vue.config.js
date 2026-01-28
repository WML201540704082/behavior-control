const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const name = "信息业务资源中台"; // 标题

const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  // 例如 https://www.tms.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.tms.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: "/gkj/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: "dist",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  chainWebpack: (config) => {
    //忽略的打包文件
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
    // 禁用CSS压缩
    config.plugins.delete('optimize-css')
  },
  devServer: {
    // 端口配置
    // port: 80,
    // 反向代理配置
    proxy: {
      // 处理所有API请求，包括带双斜杠的路径
      '^/(api|idevelop-auth|idevelop-system|//idevelop-auth|//idevelop-system)': {
        target: 'http://172.20.10.8:18084',
        // target: 'http://localhost:18084',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
          '^/idevelop-auth': '/idevelop-auth',
          '^/idevelop-system': '/idevelop-system',
          '^//idevelop-auth': '/idevelop-auth',
          '^//idevelop-system': '/idevelop-system'
        }
      }
    },
    // 防止文件监听导致的无限重新编译
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
      // 使用gzip解压缩静态文件
      new CompressionPlugin({
        test: /\.(js|html)?$/i, // 压缩文件格式，移除css
        filename: "[path].gz[query]", // 压缩后的文件名
        algorithm: "gzip", // 使用gzip压缩
        minRatio: 0.8, // 压缩率小于1才会压缩
      }),
    ],
  }
}
