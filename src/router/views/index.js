import Layout from '@/page/index/'

export default [
  {
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [{
      path: 'index',
      name: '首页',
      meta: {
        i18n: 'dashboard'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/index')
    }, {
      path: 'dashboard',
      name: '控制台',
      meta: {
        i18n: 'dashboard',
        menu: false,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
    }]
  },

  {
    path: '/personalDesk/desk',
    component: Layout,
    redirect: '/personalDesk/desk/index',
    children: [{
      path: 'index',
      name: '个人工作台',
      meta: {
        i18n: 'dashboard'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/personalDesk/desk')
    },]
  },


  {
    path: '/test',
    component: Layout,
    redirect: '/test/index',
    children: [{
      path: 'index',
      name: '测试页',
      meta: {
        i18n: 'test'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/util/test')
    }]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [{
      path: 'index',
      name: '个人信息',
      meta: {
        i18n: 'info'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/user/info')
    }]
  },
  {
    path: '/xcnanr',
    component: Layout,
    children: [
      {
        path: 'roomAccessControl',
        name: '门禁管理',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/authManage/authConfiguration/roomAccessControl/accessControl/index')
      },
      {
        path: 'cameraList',
        name: '摄像头管理',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/authManage/authConfiguration/roomVideo/components/Camera.vue')
      },
      {
        path: 'repairPlanAdd',
        name: '新增检修计划',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationPlan/repairPlan/AddEditForm')
        // import( '@/views/xcnanr/operationPlan/repairPlan/RepairPlanForm')
      },
      {
        path: 'repairPlanEdit',
        name: '编辑检修计划',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationPlan/repairPlan/AddEditForm')
      },
      {
        path: 'repairPlanApprove',
        name: '审批检修计划',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationPlan/repairPlan/ApproveForm')
      },
      {
        path: 'repairPlanDetail',
        name: '检修计划详情',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationPlan/repairPlan/DetailForm')
      },
      {
        path: 'tempAuthAdd',
        name: '新增临时授权',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/authManage/temporaryAuth/addForm')
      },
      {
        path: 'tempAuthDetail',
        name: '临时授权详情',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/authManage/temporaryAuth/detail2')
      },
      {
        path: 'visitationConfigAdd',
        name: '新增巡视配置项',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationOrder/visitationConfig/addTab')
      },
      {
        path: 'visitationConfigEdit',
        name: '编辑巡视配置项',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationOrder/visitationConfig/addTab')
      },
      {
        path: 'RiskManagementAdd',
        name: '新增风险管控卡',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationPlan/riskcontrol/addRiskManagement.vue')
      },
      {
        path: 'RiskManagementEdit',
        name: '编辑风险管控卡',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationPlan/riskcontrol/addRiskManagement.vue')
      },
      {
        path: 'inspectPlanAdd',
        name: '新增巡视计划',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationPlan/inspectionPlan/AddEditForm')
      },
      {
        path: 'inspectPlanEdit',
        name: '编辑巡视计划',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationPlan/inspectionPlan/AddEditForm')
      },
      {
        path: 'inspectPlanApproval',
        name: '审批巡视计划',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationPlan/inspectionPlan/ApproveForm')
      },
      {
        path: 'inspectPlanDetail',
        name: '巡视计划详情',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationPlan/inspectionPlan/DetailForm')
      },
      {
        path: 'inspectWorkOrderAdd',
        name: '新增巡视工单',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationOrder/visitation/AddEditForm')
      },
      {
        path: 'inspectWorkOrderEdit',
        name: '编辑巡视工单',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationOrder/visitation/AddEditForm')
      },
      {
        path: 'inspectWorkOrderFeedback',
        name: '反馈巡视工单',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationOrder/visitation/FeedbackForm')
      },
      {
        path: 'inspectWorkOrderDetail',
        name: '巡视工单详情',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/operationOrder/visitation/detail')
      },
      {
        path: 'inspectReport',
        name: '巡视报告',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/statisticalAnalysis/oldStatistics/report/index')
      },
      {
        path: 'infoInspectionStaticsDetail',
        name: '巡视作业统计详情',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/statisticalAnalysis/oldStatistics/StatisticsOnPatrolOperations/details')
      },
      {
        path: 'infoInspectionStaticsReport',
        name: '巡视报告',
        meta: {
          i18n: 'dashboard'
        },
        component: () =>
          import( '@/views/xcnanr/statisticalAnalysis/oldStatistics/StatisticsOnPatrolOperations/details')
      },
      {
        path: 'repairOrder',
        name: '检修工单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/repairOrder/index.vue')
      },
      {
        path: 'repairOrderEdit',
        name: '编辑检修工单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/repairOrder/components/OverhaulEdits.vue')
      },
      {
        path: 'repairOrderAdd',
        name: '新增检修工单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/repairOrder/components/RepairOrderForm.vue')
      },
      {
        path: 'repairOrderDetail',
        name: '检修工单详情',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/repairOrder/components/RepairOrderDetail.vue')
      },
      {
        path: 'repairOrderChange',
        name: '变更检修工单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/repairOrder/components/change.vue')
      },
      {
        path: 'repairOrderAdopt',
        name: '审批检修工单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/repairOrder/components/Adopt.vue')
      },
      {
        path: 'repairOrderFeedback',
        name: '终结检修工单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/repairOrder/components/FeedbackRepairOrder')
      },
      {
        path: 'MaintenanceAdd',
        name: '新增维修工单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/maintanceorders/addMaintenance')
      },
      {
        path: 'MaintenanceEdit',
        name: '编辑维修工单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/maintanceorders/addMaintenance')
      },
      {
        path: 'MaintenanceFeedback',
        name: '维修工单反馈',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/maintanceorders/detailMaintenance.vue')
      },
      {
        path: 'MaintenanceDispatch',
        name: '维修工单派单',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/maintanceorders/addMaintenance')
      },
      {
        path: 'MaintenanceDetail',
        name: '维修工单详情',
        meta: {
          i18n: 'dashboard',
        },
        component: () =>
          import('@/views/xcnanr/operationOrder/maintanceorders/detailMaintenance.vue')
      }
    ]
  }

]
