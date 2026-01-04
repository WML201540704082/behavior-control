/*隐患提报*/
import request from '@/router/axios'

//获取责任单位数据
export function groupCount(query) {
  return request({
    url: '/api/idevelop-hidden/hidden/home/group/count',
    method: 'get',
    params: query
  })
}

//提报列表
export function mapDisplay(query) {
  return request({
    url: '/api/idevelop-hidden/hidden/home/map/display',
    method: 'get',
    params: query
  })
}

//整改列表
export function rectificationCount(data) {
  return request({
    url: '/api/idevelop-hidden/hidden/home/rectification/count',
    method: 'post',
    data
  })
}

//记录列表
export function orgCount(query) {
  return request({
    url: '/api/idevelop-hidden/hidden/home/org/count',
    method: 'get',
    params: query
  })
}

//流程日志
export function extensionCount(query) {
  return request({
    url: '/api/idevelop-hidden/hidden/home/extension/count',
    method: 'get',
    params: query
  })
}

export default {
  //getData
}
