import request from '@/router/axios';


/**
 * 查询分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export const getBastion = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/bastion',
  method: 'get',
  params: query
})


/**
 * 更新堡垒机状态
 * @param query
 * @returns {AxiosPromise}
 */
export const updateEnabled = (query) => request({
  url: `/api/idevelop-xcnanr/xcnanr/bastion/${query.id}/${query.enabled}`,
  method: 'put',
})


/**
 * 删除堡垒机
 * @returns {AxiosPromise}
 * @param selectionList
 */
export const deleteBastion = (selectionList) => request({
  url: `/api/idevelop-xcnanr/xcnanr/bastion`,
  method: 'delete',
  data: selectionList
})

/**
 * 新增堡垒机
 * @returns {AxiosPromise}
 * @param data
 */
export const addBastion = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/bastion`,
  method: 'post',
  data: data
})

/**
 * 批量新增堡垒机
 * @returns {AxiosPromise}
 * @param data
 */
export const batchAddBastion = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/bastion/batchAdd`,
  method: 'post',
  data: data
})

/**
 * 编辑堡垒机
 * @returns {AxiosPromise}
 * @param data
 */
export const updateBastion = (data) => request({
  url: `/api/idevelop-xcnanr/xcnanr/bastion`,
  method: 'put',
  data: data
})

/**
 * 连通性测试
 * @param query
 * @returns {AxiosPromise}
 */
export const testConnection = (bastionId) => request({
  url: '/api/idevelop-xcnanr/xcnanr/bastion/testConnection',
  method: 'get',
  params: { bastionId: bastionId }
})

/**
 * 导出
 * @param query
 */
export const getBastionXlsx = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/bastion/getBastionXlsx',
  method: 'get',
  params: query
})

// 导出映射
export const outBastionXlsx = {
  name: "堡垒机名称",
  companyName: "所属公司名称",
  ip: "IP地址",
  sdkPort: "SDK端口",
  mac: "MAC地址",
  loginName: "用户名",
  loginPwd: "密码",
  brand: "品牌",
  model: "型号",
  manageUser: "管理人员",
  enabled: "是否启用",
  status: "状态",
  createUserName: "创建人姓名",
  createTime: "创建时间",
  updateUserName: "更新人姓名",
  updateTime: "更新时间"
}

// 导入映射
export const inBastionXlsx = {
  '堡垒机名称': "name",
  '所属公司名称': "companyName",
  '所属公司ID': "companyId",
  'IP地址': "ip",
  'SDK端口': "sdkPort",
  'MAC地址': "mac",
  '用户名': "loginName",
  '密码': "loginPwd",
  '品牌': "brand",
  '型号': "model",
  '管理人员': "manageUser",
  '是否启用': "enabled",
  '状态': "status",
  '创建人姓名': "createUserName",
  '创建时间': "createTime",
  '更新人姓名': "updateUserName",
  '更新时间': "updateTime"
}

/**
 * 获取已经同步的设备列表
 * @param data
 */
export const getSyncedDeviceApi = (id) => request({
  url: '/api/idevelop-xcnanr/xcnanr/bastion/getSyncedDevice',
  method: 'get',
  params: { id: id }
})
