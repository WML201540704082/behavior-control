import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/cmdbui/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/idevelop-device/cmdbui/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const save = (row) => {
  return request({
    url: '/api/idevelop-device/cmdbui/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-device/cmdbui/update',
    method: 'post',
    data: row
  })
}

