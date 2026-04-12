import request from '@/router/axios';


export const getOverdueCmdbList = (param) => {
  return request({
    url: '/api/idevelop-device/device/overdue/overdue/list',
    method: 'get',
    params: {
      ...param
    }
  })
}

export const refreshUseAge = () => request({
  url: '/api/idevelop-device/device/overdue/refresh/useage',
  method: 'get'
})

export const refreshAsset = () => request({
  url: '/api/idevelop-device/device/overdue/refresh/asset',
  method: 'get'
})

export const getDeviceAgeConfig = (param) => {
  return request({
    url: '/api/idevelop-device/device/operation/age/config/getOneByDeviceType',
    method: 'get',
    params: {
      ...param
    }
  })
}

export const overdueDeviceStatistics = () => {
  return request({
    url: '/api/idevelop-device/device/overdue/statistics',
    method: 'get',
  })
}

export const overdueDeviceAgeStatistics = (row) => {
  return request({
    url: '/api/idevelop-device/device/overdue/age/statistics',
    method: 'get',
    data: row,
    params: {
      ...row
    }
  })
}

export const getDeviceAssetCaching = (param) => {
  return request({
    url: '/api/idevelop-device/device/asset/caching/list',
    method: 'get',
    params: {
      ...param
    }
  })
}




