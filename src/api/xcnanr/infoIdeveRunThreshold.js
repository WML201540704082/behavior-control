import request from '@/router/axios';


// 查询分页列表
export const getByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/runThreshold/getByPage',
  method: 'get',
  params: query
})

// 新增
export const add = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/runThreshold/add',
    method: 'post',
    data: row
  })
}


// 修改
export const edit = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/runThreshold/edit',
    method: 'post',
    data: row
  })
}

// 删除
export const deleteByIds = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/runThreshold/deleteByIds',
    method: 'post',
    data: row
  })
}

export default { getByPage, add, edit, deleteByIds }
