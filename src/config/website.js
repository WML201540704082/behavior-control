/**
 * 全局配置文件
 */
export default {
  version: "1.0.0",
  title: "信息业务资源中台",
  indexTitle: 'Idevelop Admin',
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  captchaMode: true, // 是否开启验证码模式
  logo: "S",
  key: 'idevelop',//配置主键,目前用于存储
  lockPage: '/lock',
  tokenTime: 100,
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  },
  // 授权地址
  authUrl: '',
  reportUrl: '',
  // 统一权限单点登录认证地址
  iscssoUrl_prod: '',
  iscssoUrl_dev: ''
}
