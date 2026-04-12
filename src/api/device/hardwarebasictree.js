import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/hardwarebasictree/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (ciId) => {
  return request({
    url: '/api/idevelop-device/hardwarebasictree/detail',
    method: 'get',
    params: {
      ciId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/hardwarebasictree/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-device/hardwarebasictree/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/hardwarebasictree/submit',
    method: 'post',
    data: row
  })
}

export const refresh = (keyword) => {
  return request({
    url: '/api/idevelop-device/hardwarebasictree/refresh',
    method: 'get',
    params: {
      keyword
    }
  })
}

// 
// 属性配置列表
export const cmdbciattrgradePage = (query) => {
  return request({
    url: '/api/idevelop-device/cmdbciattrgrade/list',
    method: 'get',
    params: query
  })
}

// 配置保存
export const cmdbciattrgradeUpdate = (query) => {
  return request({
    url: '/api/idevelop-device/cmdbciattrgrade/update',
    method: 'post',
    data: query
  })
}

// 配置刷新
export const cmdbciattrgradeRefresh = (query) => {
  return request({
    url: '/api/idevelop-device/cmdbciattrgrade/refresh',
    method: 'get',
    params: query
  })
}

// 删除 
export const cmdbciattrgradeRemove = (query) => {
  return request({
    url: '/api/idevelop-device/cmdbciattrgrade/remove',
    method: 'post',
    params: query
  })
}



