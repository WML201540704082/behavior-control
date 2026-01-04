import request from '@/router/axios';

// 全局属性管理
// 属性列表
export const globalattrSearch = (query) => request({
  url: '/api/idevelop-device/I6000/external/list',
  method: 'get',
  params: query
})

// 属性详情
export const globalattrDetail = (query) => request({
  url: '/api/idevelop-device/I6000/external/detail',
  method: 'get',
  params: query
})

// 新增
export const globalattrSave = (query) => request({
  url: '/api/idevelop-device/I6000/external/save',
  method: 'post',
  data: query
})

// 修改
// export const globalattrUpdate = (query) => request({
//   url: '/api/idevelop-device/I6000Cmdbmapping/update',
//   method: 'post',
//   data: query
// })

// 属性删除
export const globalattrDel = (query) => request({
  url: '/api/idevelop-device/I6000/external/remove',
  method: 'post',
  params: query
})

//外部数据下拉框Code
export const getExtCodeList = (query) => request({
  url: '/api/idevelop-device/I6000/external/getExtCodeList',
  method: 'get',
  params: query
})


// // 模型属性映射表接口------------分页
// export const cmdbciattrList = (query) => request({
//   url: '/api/idevelop-device/cmdbciattr/list',
//   method: 'get',
//   params: query
// })

// // i6000模型属性接口------------分页
// export const i6000ciattrList = (query) => request({
//   url: '/api/idevelop-device/i6000ciattr/list',
//   method: 'get',
//   params: query
// })

// // 获取CMDB和I6000的需映射模型
// export const i6000Mapping = (query) => request({
//   url: '/api/idevelop-device/hardwarebasictree/cmdb/i6000/mapping',
//   method: 'get',
//   params: query
// })
