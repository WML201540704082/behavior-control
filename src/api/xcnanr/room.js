import request from '@/router/axios';


// 查询单个机房
export const getById = (roomId) => request({
  url: '/api/idevelop-xcnanr/xcnanr/room/getById/' + roomId,
  method: 'get'
})

// 查询分页列表
export const getByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/room/getByPage',
  method: 'get',
  params: query
})

// 获取全部
export const getAll = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/room/getAll',
  method: 'get',
  params: query
})

/**
 * 查询所有机房
 * @param query
 * @returns {AxiosPromise}
 */
export const getAllRoom = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/room/getAll',
  method: 'get',
  params: query
})

// 新增
export const add = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/room/add',
    method: 'post',
    data: row
  })
}

// 批量新增
export const batchAdd = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/room/batchAdd',
    method: 'post',
    data: row
  })
}


// 修改
export const edit = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/room/edit',
    method: 'post',
    data: row
  })
}

// 删除
export const deleteByIds = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/room/deleteByIds',
    method: 'post',
    data: row
  })
}

// 定义需要导入的列
export const inRoomAc = {
  '机房名称': "name",
  '机房类型': "type",
  '归属公司': "companyName",
  '所属公司ID': "companyId",
  '备注': "remark",
  '创建人': "createUserName",
  '创建时间': "createTime",
  '更新人': "updateUserName",
  '更新时间': "updateTime"
}


