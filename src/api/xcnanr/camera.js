
import request from '@/router/axios';

/**
 * 查询分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export const getCamera = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/camera',
  method: 'get',
  params: query
})

/**
 * 删除摄像头
 * @param query
 * @returns {AxiosPromise}
 */
export const deleteCamera = (selectionList) => request({
  url: `/api/idevelop-xcnanr/xcnanr/camera`,
  method: 'delete',
  data: selectionList
})

/**
 * 新增摄像头
 * @returns {AxiosPromise}
 * @param data
 */
export const addCamera = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/camera`,
  method: 'post',
  data: data
})

/**
 * 编辑摄像头
 * @returns {AxiosPromise}
 * @param data
 */
export const updateCamera = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/camera`,
  method: 'put',
  data: data
})

/**
 * 导出
 * @param query
 */
export const getCameraXlsx = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/camera/getCameraXlsx',
  method: 'get',
  params: query
})

/**
 * 批量新增录像机
 * @returns {AxiosPromise}
 * @param data
 */
export const batchAddNvr = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/camera/batchAdd`,
  method: 'post',
  data: data
})

// 导出映射
export const outCameraXlsx = {
  name: "摄像头名称",
  companyName: "所属公司名称",
  ip: "IP地址",
  port: "端口",
  channel: "通道",
  status: "状态",
  createUserName: "创建人姓名",
  createTime: "创建时间",
  updateUserName: "更新人姓名",
  updateTime: "更新时间"
}

// 导入映射
export const inCameraXlsx = {
  '摄像头名称': "name",
  '所属录像机ID': "nvrId",
  '所属机房ID': "roomId",
  '所属公司名称': "companyName",
  '所属公司区域代码': "companyRegionCode",
  '所属公司ID': "companyId",
  'IP地址': "ip",
  '端口': "port",
  '通道': "channel",
  '状态': "status",
  '创建人姓名': "createUserName",
  '创建时间': "createTime",
  '更新人姓名': "updateUserName",
  '更新时间': "updateTime",
}
