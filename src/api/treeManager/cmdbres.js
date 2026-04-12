import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/cmdbdictci/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/cmdbdictci/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/cmdbdictci/update',
    method: 'post',
    data: row
  })
}
