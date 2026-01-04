import request from '@/router/axios';

export const getRacksList = (params) => {
  return request({
    url: '/api/idevelop-device/resource/racks/page',
    method: 'get',
    params: params
  })
}

export const getRacksDetail = (id) => {
  return request({
    url: '/api/idevelop-device/resource/racks/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const removeRacks = (ids) => {
  return request({
    url: '/api/idevelop-device/resource/racks/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const addRacks = (row) => {
  return request({
    url: '/api/idevelop-device/resource/racks/submit',
    method: 'post',
    data: row
  })
}

export const updateRacks = (row) => {
  return request({
    url: '/api/idevelop-device/resource/racks/submit',
    method: 'post',
    data: row
  })
}

export const getDeviceList = (row) => {
  return request({
    url: '/api/idevelop-device/resource/racks/device/list',
    method: 'get',
    params: row
  })
}
export const getDeviceDetail = (row) => {
  return request({
    url: '/api/idevelop-device/resource/racks/cientity/detail',
    method: 'get',
    params: row
  })
}
