import request from '@/router/axios';

/**
 * 查询分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export const getNvr = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/nvr',
  method: 'get',
  params: query
})

/**
 * 根据ID查录像机
 * @returns {AxiosPromise}
 * @param id
 */
export const getNvrInfo = (id) => request({
  url: `/api/idevelop-xcnanr/xcnanr/nvr/${id}`,
  method: 'get',
})



/**
 * 查询所有录像机
 * @param query
 * @returns {AxiosPromise}
 */
export const getAllNvr = () => request({
  url: '/api/idevelop-xcnanr/xcnanr/nvr/getAllNvr',
  method: 'get',
})

/**
 * 删除录像机
 * @param query
 * @returns {AxiosPromise}
 */
export const deleteNvr = (selectionList) => request({
  url: `/api/idevelop-xcnanr/xcnanr/nvr`,
  method: 'delete',
  data: selectionList
})

/**
 * 新增录像机
 * @returns {AxiosPromise}
 * @param data
 */
export const addNvr = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/nvr`,
  method: 'post',
  data: data
})

/**
 * 批量新增录像机
 * @returns {AxiosPromise}
 * @param data
 */
export const batchAddNvr = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/nvr/batchAdd`,
  method: 'post',
  data: data
})

/**
 * 编辑录像机
 * @returns {AxiosPromise}
 * @param data
 */
export const updateNvr = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/nvr`,
  method: 'put',
  data: data
})

/**
 * 导出录像机
 * @param query
 */
export const getNvrXlsx = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/nvr/getNvrXlsx',
  method: 'get',
  params: query
})

// 导出映射
export const outNvrXlsx = {
  name: "录像机名称",
  roomName: "机房名称",
  companyName: "所属公司名称",
  ip: "IP地址",
  port: "端口",
  brand: "品牌",
  status: "状态",
  loginName: "用户名",
  loginPwd: "密码",
  channelCount: "通道数量",
  createUserName: "创建人姓名",
  createTime: "创建时间",
  updateUserName: "更新人姓名",
  updateTime: "更新时间"
}

export const inNvrXlsx = {
  '录像机名称': "name",
  '机房名称': "roomName",
  '机房ID': "roomId",
  '所属公司名称': "companyName",
  '所属公司ID': "companyId",
  'IP地址': "ip",
  '端口': "port",
  '品牌': "brand",
  '状态': "status",
  '用户名': "loginName",
  '密码': "loginPwd",
  '通道数量': "channelCount",
  '创建人姓名': "createUserName",
  '创建时间': "createTime",
  '更新人姓名': "updateUserName",
  '更新时间': "updateTime"
}
