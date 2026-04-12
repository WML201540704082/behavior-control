import request from '@/router/axios';

// 全局属性管理
// 属性列表
// export const governanceSituation = (query) => request({
//   url: '/api/idevelop-device/staatistics/governance/situation',
//   method: 'get',
//   params: query
// })

// 地市区县治理情况统计接口
export const governanceCounty = (query) => request({
  url: '/api/idevelop-device/staatistics/governance/county',
  method: 'get',
  params: query
})

// 地区枚举
export const governanceRegion = (query) => request({
  url: '/api/idevelop-device/staatistics/governance/region',
  method: 'get',
  params: query
})