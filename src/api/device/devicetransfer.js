import request from '@/router/axios';

export const transferImport = (row) => {
  return request({
    url: '/api/idevelop-device/device/transfer/import',
    method: 'post',
    data: row
  })
}

export const getList = (params) => {
  return request({
    url: '/api/idevelop-device/device/transfer/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/idevelop-device/device/transfer/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/device/transfer/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/device/transfer/save',
    method: 'post',
    data: row
  })
}

export const submit = (row) => {
  return request({
    url: '/api/idevelop-device/device/transfer/submit',
    method: 'post',
    data: row
  })
}

export const getEmpty = (id='-----') => {
  return request({
    url: '/api/idevelop-device/device/transfer/detail',
    method: 'get',
    params: {
      id
    }
  })
}


export const getDeviceList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/device/transfer/detail/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

