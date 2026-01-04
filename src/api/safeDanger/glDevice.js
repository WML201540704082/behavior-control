import request from '@/router/axios'

// 字典枚举值查询接口
export function getList(params) {
  return request({
    url: '/msdp-hiddendanger/hidden/device/cientity/list',
    method: 'get',
    params: params
  })
}

// 字典枚举值查询接口
export function enumAll() {
  return request({
    url: '/msdp-hiddendanger/hidden/device/enum/all',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 999
    }
  })
}


// 根基ciID获取字典下数据
export function getEnumValues(enumCiId) {
  return request({
    url: '/msdp-hiddendanger/hidden/device/enum/values',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 200,
      enumCiId: enumCiId
    }
  })
}

//字典级联关系查询
export function getDictList(params) {
  return request({
    url: '/msdp-hiddendanger/hidden/device/dict/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
