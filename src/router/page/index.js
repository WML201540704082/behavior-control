import Layout from '@/page/index/'
export default [{
    path: '/login',
    name: '登录页',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/page/login/index'),
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/lock',
    name: '锁屏页',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/page/lock/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/404',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/error-page/404'),
    name: '404',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }

},
{
    path: '/403',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/error-page/403'),
    name: '403',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/500',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/error-page/500'),
    name: '500',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/ictOperationManage',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/ictOperation/index'),
    name: '信创运维',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/resourceDetail',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/ictOperation/components/resourceComponents/detailPage'),
    name: '文档详情',
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/ictHome',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/ictOperation/components/ictHome/index'),
    name: '首页',
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/',
    name: '主页',
    redirect: '/wel/index/index'
},
{
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    children: [{
        path: ":routerPath",
        name: 'iframe',
        component: () =>
            import( /* webpackChunkName: "page" */ '@/components/iframe/main'),
        props: true
    }]

},
{
    path: '*',
    redirect: '/404'
}
]
