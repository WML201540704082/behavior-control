import request from '@/router/axios';

export const getHardwareList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/basic/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getHardwareDetail = (dthbId) => {
  return request({
    url: '/api/idevelop-data/hardware/basic/detail',
    method: 'get',
    params: {
      dthbId
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-data/hardware/basic/update',
    method: 'post',
    data: row
  })
}

export const getHardwareCMDBList = (current, size, params) => {
  return request({
    url: '/api/idevelop-data/hardware/basic/list/cmdb',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
