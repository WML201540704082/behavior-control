import request from '@/router/axios';

// 桌面应用维护列表
export const getDesktopAppList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcdesktopapp/list',
    method: 'get',
    params: params
  })
}

// 桌面应用维护详情
export const getDesktopAppDetail = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcdesktopapp/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 桌面应用维护新增
export const addDesktopApp = (data) => {
  return request({
    url: '/api/idevelop-ipc/ipcdesktopapp/save',
    method: 'post',
    data: data
  })
}
// 桌面应用维护编辑
export const updateDesktopApp = (data) => {
  return request({
      url: '/api/idevelop-ipc/ipcdesktopapp/update',
      method: 'post',
      data: data
  })
}
// 桌面应用维护删除
export const desktopAppRemove = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcdesktopapp/remove',
    method: 'post',
    data: {
      id,
    }
  })
}
