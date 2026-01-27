/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from './store'
import {validatenull} from '@/util/validate'
import {getToken} from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {setTheme} from "@/util/util";
import {Message} from "element-ui";

NProgress.configure({showSpinner: false});
const lockPage = store.getters.website.lockPage; //锁屏页
router.beforeEach(async (to, from, next) => {
  const meta = to.meta || {};
  const isMenu = meta.menu === undefined ? to.query.menu : meta.menu;
  store.commit('SET_IS_MENU', isMenu === undefined);


  //keep-alive页面保持
  if (to.path === '/assets/comdevManage') {
    to.meta.keepAlive = true
  }

  // 信通修改--浏览器刷新时重置主题样式
  if (from.fullPath == '/') {
    setTheme(store.getters.themeName);
  }
  if (getToken()) {
    if (store.getters.isLock && to.path !== lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
      next({path: lockPage})
    } else if (to.path === '/login') { //如果登录成功访问登录页跳转到主页
      next({path: '/'})
    } else {
      //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
      if (store.getters.token.length === 0) {
        store.dispatch('FedLogOut').then(() => {
          next({path: '/login'})
        })
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;
        const meta = to.meta || router.$avueRouter.meta || {};
        const i18n = to.query.i18n;


        if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          store.commit('ADD_TAG', {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            meta: (() => {
              if (!i18n) {
                return meta
              }
              return {
                i18n: i18n
              }
            })(),
            group: router.$avueRouter.group || []
          });
        }
        if (Object.keys(store.state.common.govern).length == 0) {
          //页面刷新时用
          store.dispatch("GetUserDetail").then(() => {
            store.dispatch("GetUserUnit", store.state.user.userDetail.ownerUnit);
            store.dispatch("GetCustomId").then(() => {
            }).finally(() => {
              if (to.path == "/wel/index" || to.path == "/personalDesk/desk") { // 跳转到首页详情
                next('/wel/index/index')
              } else {
                next()
              }
            });
          }).catch(err => {
            Message.closeAll();
          })
        } else {
          // next();
          let userDetial = store.state.user.userDetail;
          if (userDetial && Object.keys(userDetial).length > 0) {
            if (to.path == "/wel/index" || to.path == "/personalDesk/desk") { // 跳转到首页详情
              next('/wel/index/index')
            } else {
              next()
            }
          } else {
            store.dispatch("GetUserDetail").then(() => {
              store.dispatch("GetUserUnit", store.state.user.userDetail.ownerUnit)
              if (to.path == "/wel/index" || to.path == "/personalDesk/desk") { // 跳转到首页详情
                next('/wel/index/index')
              } else {
                next()
              }
            })
          }
        }
      }
    }
  } else {
    // 没有token
    const url = location.search
    const ticket = url.substring(url.indexOf('=') + 1)
    if (url.indexOf('ticket') !== -1) { // 是否是单点登录
      let loginForm = {
        ticket: ticket,
        tenantId: "000000"
      }
      await store.dispatch("LoginByIscTicket", loginForm).then(() => {
        //router.push({path: this.tagWel.value});
        next({path: '/'})
      }).catch(() => {
      });
    }
    //判断是否需要认证，没有登录访问去登录页
    if (meta.isAuth === false) {
      store.state.user.userDetail = {};
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done();
  let title = store.getters.tag.label;
  let i18n = store.getters.tag.meta.i18n;
  title = router.$avueRouter.generateTitle(title, i18n)
  //根据当前的标签也获取label的值动态设置浏览器标题
  router.$avueRouter.setTitle(title);
});
