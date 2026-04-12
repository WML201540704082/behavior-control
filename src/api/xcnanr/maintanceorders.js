import request from '@/router/axios';

// 全局属性管理
// 查询列表
// export const getList = (query) => request({
//   url: '/api/idevelop-xcnanr/visitionConfig/list',
//   method: 'get',
//   params: query
// })

// 查询分页列表
export const getListByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/maintance/getByPage',
  method: 'get',
  params: query
})

// 删除
export const delllByIds = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/maintance/dellByIds',
  method: 'get',
  params: query
})

// 派单
export const dispatch = (data) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/maintance/dispatch',
    method: 'post',
    data: data
  })
}
//反馈
export const feedback = (data) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/maintance/feedbackOrder',
    method: 'post',
    data: data
  })
}
// 新增
export const insertRepair = (data) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/maintance/insertMaintance',
    method: 'post',
    data: data
  })
}

// 查看详情
export const getDetails = (id) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/maintance/getDetails',
    method: 'get',
    params: id,
  })
}

// 删除
export const dellByIds = (ids) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/maintance/dellByIds/'+ids,
    method: 'get',
  })
}

// 属性删除
export const remove = (ids) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/deleteBatch',
    method: 'delete',
    params: {
      ids,
    }
  })
}
//维修人下拉框数据
export const getUsersCondi = (id) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/maintance/getUsersCondi',
    method: 'get',
    params: id,
  })
}

//导出
export const getListExport = (query) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/maintance/getListExport',
    method: 'get',
    params: query,
  })
}
