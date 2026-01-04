import request from '@/router/axios';

//列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/idevelop-device/erpkostl/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

//同步
export const refresh = (data) => {
  return request({
    url: '/api/idevelop-device/erpkostl/synchronous/refresh',
    method: 'get',
    params: data
  })
}
