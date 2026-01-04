import {
  setStore,
  getStore,
  removeStore
} from '@/util/store'
import website from '@/config/website'

const common = {

  state: {
    language: getStore({name: 'language'}) || 'zh',
    isCollapse: false,
    isFullScren: false,
    isMenu: true,
    isShade: false,
    screen: -1,
    isLock: getStore({name: 'isLock'}) || false,
    showTag: true,
    showDebug: true,
    showCollapse: true,
    showSearch: true,
    showLock: true,
    showFullScren: true,
    showTheme: true,
    showMenu: true,
    showColor: true,
    colorName: getStore({name: 'colorName'}) || '#409EFF',
    themeName: getStore({name: 'themeName'}) || 'theme-xintong',
    lockPasswd: getStore({name: 'lockPasswd'}) || '',
    website: website,
    govern: {},
    keepAliveNodes: {},//缓存过的tag集合
  },
  mutations: {
    SET_GOVERN: (state, data) => {
      //第一步：操作 前端属性配置 菜单|配置管理→前端属性配置管理页面中自行添加:例如添加一个testID
      //第二部：开发 前端页面使用 this.$store.state.common.govern.testID
      // console.log(999, data)
      let cids = {};
      if (data.records) {
        data.records.forEach((item, index) => {
          cids[item.name] = item.value;
        });
      }
      state.govern = cids;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setStore({
        name: 'language',
        content: state.language
      })
    },
    SET_SHADE: (state, active) => {
      state.isShade = active;
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_IS_MENU: (state, menu) => {
      state.isMenu = menu;
    },
    SET_LOCK: (state) => {
      state.isLock = true;
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen;
    },
    SET_COLOR_NAME: (state, colorName) => {
      state.colorName = colorName;
      setStore({
        name: 'colorName',
        content: state.colorName,
      })
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName;
      setStore({
        name: 'themeName',
        content: state.themeName,
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false;
      state.lockPasswd = '';
      removeStore({
        name: 'lockPasswd',
        type: 'session'
      });
      removeStore({
        name: 'isLock',
        type: 'session'
      });
    },
  }
}
export default common
