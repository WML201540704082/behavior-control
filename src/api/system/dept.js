import request from '@/router/axios';

export const getDeptList = (current, size, params) => {
  return request({
    url: '/api/idevelop-system/dept/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
//单位、部门 支持懒加载
export const getDeptLzayList = (params) => {
  return request({
    url: '/api/idevelop-system/dept/lazy/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}
export const getDeptDetail = (id) => {
  return request({
    url: '/api/idevelop-system/dept/detail',
    method: 'get',
    params: {
      id
    }
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/idevelop-system/dept/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/idevelop-system/dept/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/idevelop-system/dept/submit',
    method: 'post',
    data: row
  })
}

export const getDept = (id) => {
  return request({
    url: '/api/idevelop-system/dept/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getDeptTree = (tenantId) => {
  return request({
    url: '/api/idevelop-system/dept/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const getLazyList = (params) => {
  return request({
    url: '/api/idevelop-system/dept/list',
    method: 'get',
    params: {
      ...params,
      current: 999,
      size: 1,
    }
  })
}

// 获得用户所在单位下单位列表
export const deptTreeList = (params) => {
  return request({
    url: '/api/idevelop-system/dept/tree/list',
    method: 'get',
  })
}

// erp单位下拉
export const erpUnitList = () => {
  return request({
    url: '/api/idevelop-device/erpkostl/lazy/maintain',
    method: 'get',
    params: {}
  })
}
// erp部门下拉
export const erpDeptList = (params) => {
  return request({
    url: '/api/idevelop-device/erpkostl/lazy/maintain/kostl',
    method: 'get',
    params: params
  })
}


// i6000单位下拉
export const i6000UnitList = () => {
  return request({
    url: '/api/idevelop-device/i6000dept/lazy/unit',
    method: 'get',
    params: {}
  })
}
// i6000部门下拉
export const i6000deptList = (params) => {
  return request({
    url: '/api/idevelop-device/i6000dept/lazy/unit/dept',
    method: 'get',
    params: params
  })
}
