import request from '@/router/axios';


// 查询分页列表
export const getByPage = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/worker/getByPage',
  method: 'get',
  params: query
})

// 获取全部
export const getAll = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/worker/getAll',
  method: 'get',
  params: query
})

// 更改启用状态
export const changeEnable = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/changeEnable',
    method: 'post',
    data: row
  })
}

// 新增
export const add = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/add',
    method: 'post',
    data: row
  })
}

// 批量新增
export const batchAdd = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/batchAdd',
    method: 'post',
    data: row
  })
}

// 修改
export const edit = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/edit',
    method: 'post',
    data: row
  })
}

// 删除
export const deleteByIds = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/deleteByIds',
    method: 'post',
    data: row
  })
}

// 上传照片
export const uploadPic = (row) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/uploadPic',
    method: 'post',
    data: row
  })
}

// 照片预览
export const checkPic = (workerId) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/checkPic/' + workerId,
    method: 'get'
  })
}

// 上传安规二维码
export const uploadAgCode = (data) => {
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/agcode',
    method: 'post',
    data: data
  })
}

// 人员检索
export const getAllUsers = () =>{
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/getAllUsers',
    method: 'get'
  })
}

// 检查被授权人员是否有人脸信息
export const checkWorkerHasFace = (workerIds) =>{
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/checkWorkerHasFace/' + workerIds,
    method: 'get'
  })
}

// 检查被授权人员是否有人脸信息
export const getWorkerByIdIn = (workerIds) =>{
  return request({
    url: '/api/idevelop-xcnanr/xcnanr/worker/getByIdIn/' + workerIds,
    method: 'get'
  })
}

// 导出
export const getWorkXlsx = (query) => request({
  url: '/api/idevelop-xcnanr/xcnanr/worker/getWorkXlsx',
  method: 'get',
  params: query
})

/**
 * 根据登录用户ID查询用户信息
 * @param userId
 */
export const getUserByUserId = (userId) => request({
  url: '/api/idevelop-xcnanr/xcnanr/worker/getUserByUserId/' + userId,
  method: 'get'
})

// 导出映射
export const outWorkXlsx = {
  name: "姓名",
  type: "人员类型",
  companyName: "所属公司名称",
  departmentName: "授权部门名称",
  externalCompany: "外部单位",
  idCard: "身份证号",
  acCode: "门禁人员编号",
  accessCard: "卡号",
  faceInfo: "人脸信息",
  faceLength: "人脸信息长度",
  enabled: "启用状态",
  status: "状态",
  createUserName: "创建人姓名",
  createTime: "创建时间",
  updateUserName: "更新人姓名",
  updateTime: "更新时间"
}
// 导入映射
export const inWorkXlsx = {
  '姓名': "name",
  '人员类型': "type",
  '所属公司名称': "companyName",
  '所属公司ID': "companyId",
  '授权部门名称': "departmentName",
  '外部单位': "externalCompany",
  '身份证号': "idCard",
  '门禁人员编号': "acCode",
  '卡号': "accessCard",
  '人脸信息': "faceInfo",
  '人脸信息长度': "faceLength",
  '启用状态': "enabled",
  '状态': "status",
  '创建人姓名': "createUserName",
  '创建时间': "createTime",
  '更新人姓名': "updateUserName",
  '更新时间': "updateTime",
}


