import request from '@/router/axios';


// 查询分页列表
export const getByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/roomAc/getByPage',
  method: 'get',
  params: query
})

// 获取全部
export const getAll = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/roomAc/getAll',
  method: 'get',
  params: query
})

// 新增
export const add = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/roomAc/add',
    method: 'post',
    data: row
  })
}

// 修改
export const edit = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/roomAc/edit',
    method: 'post',
    data: row
  })
}

// 删除
export const deleteByIds = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/roomAc/deleteByIds',
    method: 'post',
    data: row
  })
}


// 导出
export const getRoomAcXlsx = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/roomAc/getRoomAcXlsx',
  method: 'get',
  params: query
})


