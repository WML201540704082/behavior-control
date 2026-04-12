import request from '@/router/axios';

// 全局属性管理

// 查询分页列表
export const getByPageControlInit = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/getByPageControlInit',
  method: 'get',
  params: query
})

// 删除
export const dellByIdsControl = (ids) => request({
  url: '/api/idevelop-xcnanr/xcnanr/jianxiu/dellByIdsControl/'+ids,
  method: 'get',
})

// 新增，编辑
export const insertRiskControl = (data) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/jianxiu/insertRiskControl',
    method: 'post',
    data: data
  })
}
//查看详情
export const getDetailsControl = (data) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/jianxiu/getDetailsControl',
    method: 'get',
    params: data
  })
}
// 修改启用状态
export const updateControl = (data) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/jianxiu/updateControl',
    method: 'get',
    params: data
  })
}

// 新增
export const add = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/insert',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/update',
    method: 'post',
    data: row
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
export const changeEnabled = (id) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/changeEnabled',
    method: 'post',
    params: id,
  })
}

