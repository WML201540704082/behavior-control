import request from '@/router/axios';

export const getList = (current, size, params, deptIdStr) => {
  return request({
    url: '/api/idevelop-user/list',
    method: 'post',
    data: {
      ...params,
      current,
      size,
    },
    // data: {
    //   deptId: deptIdStr
    // }
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/idevelop-user/remove',
    method: 'post',
    data: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-user/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-user/update',
    method: 'post',
    data: row
  })
}

export const grant = (userIds, roleIds) => {
  return request({
    url: '/api/idevelop-user/grant',
    method: 'post',
    data: {
      userIds,
      roleIds,
    }
  })
}

export const getUser = (id) => {
  return request({
    url: '/api/idevelop-user/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/api/idevelop-user/info',
    method: 'get',
  })
}

export const resetPassword = (userIds) => {
  return request({
    url: '/api/idevelop-user/reset-password',
    method: 'post',
    data: {
      userIds,
    }
  })
}

export const updatePassword = (oldPassword, newPassword, newPassword1,updateId) => {
  return request({
    url: '/api/idevelop-user/update-password',
    method: 'post',
    data: {
      oldPassword,
      newPassword,
      newPassword1,
      updateId
    },
    headers:{
      isImport: true
    }
  })
}

// 组织树
export const iscbaseorgTree = (query) => {
  return request({
    url: '/api/idevelop-auth/isc/iscbaseorg/tree',
    method: 'get',
    params: query
  })
}
// 人员树
export const userByBaseorgId = (query) => {
  return request({
    url: '/api/idevelop-auth/isc/userByBaseorgId',
    method: 'get',
    params: query
  })
}
// 区域树
export const getAreaTree = (query) => {
  return request({
    url: '/api/idevelop-system/region/province-tree',
    method: 'get',
    params: query
  })
}
