import request from '@/router/axios';


export const getAttr = (query) => request({
  url: '/api/idevelop-device/cmdbciattrgrade/getAttr',
  method: 'get',
  params: query
})


// 设备台账
// 侧边设备类型树
export const devBookCiTree = (query) => request({
  url: '/api/idevelop-device/hardwarebasictree/list',
  method: 'get',
  params: query
})

// 标准全称生成接口
export const restoreUpdate = (data) => request({
  url: '/api/idevelop-device/cmdb/repair/restore/update',
  method: 'post',
  data
})

// 台账列表
export const devBookList = (query) => request({
  url: '/api/idevelop-cmdb/hardwarebasic/page/list',
  method: 'post',
  data: query,
  timeout: 90000
})

// 台账详情
export const devBookDetail = (query) => request({
  url: '/api/idevelop-device/hardwarebasic/detail',
  method: 'get',
  params: query
})

// 台账字段列表
export const cmdbciattrgradePage = (query) => request({
  url: '/api/idevelop-device/cmdbciattrgrade/page',
  method: 'get',
  params: query
})

// 标准全称生成接口
export const getFullName = (params) => request({
  url: '/api/idevelop-device/device/storage/getFullName',
  method: 'post',
  data: {
    ...params
  }
})
// 资产管理-导入保存接口
export const batchSave = (query) => request({
  url: '/api/idevelop-device/hardwarebasic/cmdb/batchSave',
  method: 'post',
  data: query
})
// 资产管理-删除接口
export const remove = (data) => request({
  url: '/api/idevelop-device/hardwarebasic/batch/delete',
  method: 'post',
  data: {
    ...data,
  }
})
// 资产管理更新前校验接口
export const cmdbDataCheck = (data) => request({
  url: '/api/idevelop-device/hardwarebasic/cmdb/cmdbDataCheck',
  method: 'post',
  data: data
})
// 根据IP地址获取网络设备属性
export const getInfoByIP = (ip) => request({
  url: '/api/idevelop-device/hardwarebasic/cmdb/getInfoByIP',
  method: 'get',
  params: ip
})
// 根据条件获取 I6000 相关数据信息
export const getInfoByErp = (pms) => request({
  url: '/api/idevelop-device/hardwarebasic/i6000/info',
  method: 'get',
  params: pms
})

// 数据治理→资产管理 导出记录列表
export const downloadInfo = (current, size, params) => request({
  url: '/api/idevelop-device/hardwarebasic/cmdb/download-info',
  method: 'post',
  data: {
    ...params,
    page: {
      current,
      size,
    }
  }
})
// 数据治理→资产管理 导出记录删除
export const downloadDelete = (ids) => request({
  url: '/api/idevelop-device/hardwarebasic/cmdb/download-delete',
  method: 'post',
  data: ids
})

// 数据治理→资产管理 导出记录 统计下载次数
export const addNums = (pms) => request({
  url: '/api/idevelop-device/hardwarebasic/cmdb/add-nums',
  method: 'get',
  params: pms
})
// 数据治理→资产管理 导出记录统计未下载的个数
export const allNums = (pms) => request({
  url: '/api/idevelop-device/hardwarebasic/cmdb/all-nums',
  method: 'get',
  params: pms
})
