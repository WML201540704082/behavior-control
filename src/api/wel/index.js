import request from '@/router/axios';

// export const getApproveList = (params) => {
//   return request({
//     url: '/api/idevelop-device/approve/record/list',
//     method: 'get',
//     params: params
//   })
// }
// 台账概览设备统计接口
export const deviceCount = (data) => {
  return request({
    url: '/api/idevelop-device/home/deviceCount',
    method: 'post',
    data
  })
}
// 台账概览设备统计接口
export const distributeCount = (data) => {
  return request({
    url: '/api/idevelop-device/home/distributeCount',
    method: 'post',
    data
  })
}
// 芯片架构(ARM)
export const frameworkArm = (data) => {
  return request({
    url: '/api/idevelop-device/home/frameworkArm',
    method: 'post',
    data
  })
}
// 芯片架构(X86)
export const frameworkX86 = (data) => {
  return request({
    url: '/api/idevelop-device/home/frameworkX86',
    method: 'post',
    data
  })
}
// 实时在线分布趋势图
export const online = (data) => {
  return request({
    url: '/api/idevelop-device/home/online',
    method: 'post',
    params: data
  })
}
// 告警处置一周统计
export const warningCount = (data) => {
  return request({
    url: '/api/idevelop-device/home/warningCount',
    method: 'post',
    data
  })
}
// 实时告警信息
export const warningDetail = (data) => {
  return request({
    url: '/api/idevelop-device/home/warningDetail',
    method: 'post',
    data
  })
}
// 超龄分布图
export const oldAge = (data) => {
  return request({
    url: '/api/idevelop-device/home/oldAge',
    method: 'post',
    data
  })
}
// 设备老旧趋势图
export const oldTrend = (data) => {
  return request({
    url: '/api/idevelop-device/home/oldTrend',
    method: 'post',
    data
  })
}