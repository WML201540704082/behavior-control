import request from '@/router/axios';

export const getRoomList = (params) => {
  return request({
    url: '/api/idevelop-device/resource/room/page',
    method: 'get',
    params: params
  })
}

export const getRoomDetail = (uuid) => {
  return request({
    url: '/api/idevelop-device/resource/room/detail',
    method: 'get',
    params: {
      uuid
    }
  })
}

export const removeRoom = (ids) => {
  return request({
    url: '/api/idevelop-device/resource/room/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const addRoom = (row) => {
  return request({
    url: '/api/idevelop-device/resource/room/submit',
    method: 'post',
    data: row
  })
}

export const updateRoom = (row) => {
  return request({
    url: '/api/idevelop-device/resource/room/submit',
    method: 'post',
    data: row
  })
}
export const exportRoom = (ids) => {
  return request({
    url: '/api/idevelop-device/resource/room/exportExcel',
    method: 'post',
    params: {
      ids,
    }
  })
}
export const downExcel = (ids) => {
  return request({
    url: '/api/idevelop-device/resource/room/downExcel',
    method: 'post',
    params: {
      ids,
    }
  })
}
export const getAidedDeviceList = (row) => {
  return request({
    url: '/api/idevelop-device/resource/room/dev/list',
    method: 'get',
    params: row
  })
}
export const getAreaRoomList = (params) => {
  return request({
    url: '/api/idevelop-device/resource/room/area/list',
    method: 'get',
    params: params
  })
}

// 空间资源树
export const resourceLazyTree = (params) => {
  return request({
    url: '/api/idevelop-device/resource/room/lazy-tree',
    method: 'get',
    params: params
  })
}

// 部门懒加载树
export const resourceDeptTree = (params) => {
  return request({
    url: '/api/idevelop-device/resource/room/deptTree',
    method: 'get',
    params: params
  })
}

export const getI6000RoomList = (params) => {
  return request({
    url: '/api/idevelop-device/I6000/get/room',
    method: 'get',
    params: params
  })
}

export const batchSubmit = (params) => {
  return request({
    url: '/api/idevelop-device/resource/room/batch/submit',
    method: 'post',
    data: params
  })
}

