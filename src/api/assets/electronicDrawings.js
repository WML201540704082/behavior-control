import request from '@/router/axios';

// 全局属性管理
// 属性列表
export const globalattrSearch = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoRoomData',
  method: 'get',
  params: query
})
//新增
export const addElectronicDrawings = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoRoomData',
  method: 'post',
  data: query
})

// 编辑
export const editElectronicDrawings = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoRoomData',
  method: 'put',
  data: query
})

// 删除
export const deleteElectronicDrawings = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/infoRoomData',
  method: 'delete',
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
  url: '/api/idevelop-device/erptranstplnr/remove',
  method: 'post',
  params: query
})

// ERP维护工厂------------分页
export const erpmaintainList = (query) => request({
  url: '/api/idevelop-device/erpmaintain/list',
  method: 'get',
  params: query
})

// 根据机房id查询明细
export const roomDataDetailList = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/roomDataDetail',
  method: 'get',
  params: query
})

export const editRoomDataDetail = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/roomDataDetail',
  method: 'put',
  data: query
})
export const deleteRoomDataDetail = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/roomDataDetail',
  method: 'delete',
  data: query
})
export const addRoomDataDetail = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/roomDataDetail/addOne',
  method: 'post',
  data: query
})
