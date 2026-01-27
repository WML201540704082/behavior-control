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
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/getByPage',
  method: 'get',
  params: query
})

// 获取全部
export const getAllInspectionConfig = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/getAll',
  method: 'get',
  params: query
})

// 详情-编辑前
export const getDataById = (id) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/getById',
    method: 'get',
    params: { id: id }
  })
}
//s批量删除
export const deleteById = (id) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/deleteBatch/'+id,
    method: 'delete',
  })
}
// 更改启用状态
export const changeStatus = (id) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/infoInspectionConfig/changeEnabled',
    method: 'get',
    params: {
      id
    }
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

