// 信创运维
import request from '@/router/axios';

// 问题佐证材料
export const uploadFile1 = (params) => {
  return request({
    url: '/api/idevelop-resource/oss/endpoint/put-file',
    method: 'post',
    data: params
  })
}
// 导入问题
export const exportUploadFile = (params) => {
  return request({
    url: '/api/idevelop-control/question/import',
    method: 'post',
    data: params
  })
}
// 导入问题
export const knowledgeUploadFile = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/load',
    method: 'post',
    data: params
  })
}




// 团队运维管理列表
export const controloperationteamPage = (params) => {
  return request({
    url: '/api/idevelop-control/controloperationteam/page',
    method: 'get',
    params: params
  })
}

// 团队运维管理详情
export const controloperationteamDetail = (params) => {
  return request({
    url: '/api/idevelop-control/controloperationteam/detail',
    method: 'get',
    params: params
  })
}

// 团队运维管理删除
export const controloperationteamRemove = (params) => {
  return request({
    url: '/api/idevelop-control/controloperationteam/remove',
    method: 'post',
    params: params
  })
}

// 团队运维管理新增
export const controloperationteamSave = (params) => {
  return request({
    url: '/api/idevelop-control/controloperationteam/save',
    method: 'post',
    data: params
  })
}

// 团队运维管理人员下拉
export const controloperationteamUser = (params) => {
  return request({
    url: '/api/idevelop-control/controloperationteam/user',
    method: 'get',
    params: params
  })
}

// 系统管理
export const knowledgeTree = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/tree',
    method: 'get',
    params: params
  })
}

// 我的学习
export const learnList = (params) => {
  return request({
    url: '/api/idevelop-control/controlknowledgelearn/learnList',
    method: 'get',
    params: params
  })
}
// 新增
export const learnSave = (params) => {
  return request({
    url: '/api/idevelop-control/controlknowledgelearn/save',
    method: 'post',
    data: params
  })
}
// 删除
export const learnDelete = (params) => {
  return request({
    url: '/api/idevelop-control/controlknowledgelearn/remove',
    method: 'post',
    params: params
  })
}

// 收藏

// 收藏列表分页
export const collectList = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/collectList',
    method: 'get',
    params: params
  })
}
// 删除收藏
export const collectDelete = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/collectDelete',
    method: 'post',
    params: params
  })
}
// 添加收藏
export const collect = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/collect',
    method: 'post',
    data: params
  })
}

// 知识暂存
export const knowledgeSave = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/save',
    method: 'post',
    data: params
  })
}
// 知识提交
export const knowledgeSubmit = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/submit',
    method: 'post',
    data: params
  })
}
// 我的知识列表
export const myKnowledge = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/myKnowledge',
    method: 'get',
    params: params
  })
}
// 我的知识列表详情
export const knowledgeDetail = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/detail',
    method: 'get',
    params: params
  })
}
// 知识审核接口
export const knowledgeReview = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/review',
    method: 'post',
    data: params
  })
}




// 智能问答
// 问答列表不分页
export const knowledgeList = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/list',
    method: 'get',
    params: params
  })
}

// 统计
export const statistic = (params) => {
  return request({
    url: '/api/idevelop-control/question/statistic',
    method: 'get',
    params: params
  })
}

// 问答列表分页
export const knowledgePage = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/page',
    method: 'get',
    params: params
  })
}
// 删除问答
export const knowledgeDelete = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/delete',
    method: 'post',
    data: params
  })
}
// 个人历史问答
export const historyAnswerList = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/history/list',
    method: 'get',
    params: params
  })
}
// 删除历史回答
export const historyAnswerDelete = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/history/delete',
    method: 'post',
    data: params
  })
}

// 个人历史问答
export const logStastic = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/log/stastic',
    method: 'get',
    params: params
  })
}

// 个人历史问答
export const newKnowledge = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/log/newKnowledge',
    method: 'get',
    params: params
  })
}

// 个人历史问答
export const personRank = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/person/rank',
    method: 'get',
    params: params
  })
}

// 最热学习
export const hotLearn = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/hotLearn',
    method: 'get',
    params: params
  })
}

// 最近学习
export const nearLearn = (params) => {
  return request({
    url: '/api/idevelop-control/knowledge/nearLearn',
    method: 'get',
    params: params
  })
}

// 问题提报
// 问题提报列表
export const questionList = (params) => {
  return request({
    url: '/api/idevelop-control/question/list',
    method: 'get',
    params: params
  })
}
// 我的问题列表
export const myQuestionList = (params) => {
  return request({
    url: '/api/idevelop-control/question/my',
    method: 'get',
    params: params
  })
}
// 待办问题
export const questionTodoList = (params) => {
  return request({
    url: '/api/idevelop-control/question/bpm/todo',
    method: 'get',
    params: params
  })
}
// 已办问题
export const questionDoneList = (params) => {
  return request({
    url: '/api/idevelop-control/question/bpm/done',
    method: 'get',
    params: params
  })
}
// 需求
export const listDemand = (params) => {
  return request({
    url: '/api/idevelop-control/question/listDemand',
    method: 'get',
    params: params
  })
}
// 催办列表
export const hasten = (params) => {
  return request({
    url: '/api/idevelop-control/question/hasten',
    method: 'get',
    params: params
  })
}
// 问题暂存
export const getNextUser = (params) => {
  return request({
    url: '/api/idevelop-control/question/getNextUser',
    method: 'get',
    params: params
  })
}
// 问题暂存
export const questionSend = (params) => {
  return request({
    url: '/api/idevelop-control/question/send',
    method: 'post',
    data: params
  })
}



// 问题暂存
export const questionSave = (params) => {
  return request({
    url: '/api/idevelop-control/question/save',
    method: 'post',
    data: params
  })
}
// 问题暂存(已办任务)
export const saveFinish = (params) => {
  return request({
    url: '/api/idevelop-control/question/saveFinish',
    method: 'post',
    data: params
  })
}
// 创建流程
export const processCreate = (params) => {
  return request({
    url: '/api/idevelop-control/question/bpm/create',
    method: 'post',
    data: params
  })
}
// 问题提交
export const questionSubmit = (params) => {
  return request({
    url: '/api/idevelop-control/question/bpm/submit',
    method: 'post',
    data: params
  })
}
// 问题解决
export const saveDemand = (params) => {
  return request({
    url: '/api/idevelop-control/question/saveDemand',
    method: 'post',
    data: params
  })
}
// 问题详情
export const questionDetail = (params) => {
  return request({
    url: '/api/idevelop-control/question/detail',
    method: 'get',
    params: params
  })
}
// 问题流程
export const allProcess = (params) => {
  return request({
    url: '/api/idevelop-control/question/bpm/history/all-process',
    method: 'get',
    params: params
  })
}
// 当前节点
export const currentProcessNode = (params) => {
  return request({
    url: '/api/idevelop-control/question/bpm/history/current-process',
    method: 'get',
    params: params
  })
}
// 审批人列表
export const auditingUserList = (params) => {
  return request({
    url: '/api/idevelop-control/question/bpm/assign/get',
    method: 'get',
    params: params
  })
}
// 删除问题
export const questionDelete = (params) => {
  return request({
    url: '/api/idevelop-control/question/delete',
    method: 'post',
    data: params
  })
}

// 资源支持
// 资源支持列表
export const resourceList = (params) => {
  return request({
    url: '/api/idevelop-control/resource/list',
    method: 'get',
    params: params
  })
}
// 删除资源
export const resourceDel = (data) => {
  // console.log(9901, data)
  return request({
    url: '/api/idevelop-control/resource/remove',
    method: 'post',
    data: {
      id: data
    }
  })
}

// 新增资源
export const resourceCollect = (params) => {
  return request({
    url: '/api/idevelop-control/resource/collect',
    method: 'post',
    data: params
  })
}
// 新增资源
export const resourceLearn = (params) => {
  return request({
    url: '/api/idevelop-control/resource/learn',
    method: 'post',
    data: params
  })
}


// 最近浏览
export const resourceRecentView = (params) => {
  return request({
    url: '/api/idevelop-control/resource/recent-view',
    method: 'get',
    params: params
  })
}
// 最新上传

export const resourceLasted = (params) => {
  return request({
    url: '/api/idevelop-control/resource/lasted',
    method: 'get',
    params: params
  })
}
// 新增资源
export const resourceSave = (params) => {
  return request({
    url: '/api/idevelop-control/resource/save',
    method: 'post',
    data: params
  })
}
// 资源详情
export const resourceDetail = (params) => {
  return request({
    url: '/api/idevelop-control/resource/detail',
    method: 'get',
    params: params
  })
}
// 下载模板
export const downloadTemplate = (params) => {
  return request({
    url: '/api/idevelop-control/question/download/template',
    method: 'post',
    data: params
  })
}
export const getPhone = () => {
  return request({
    url: '/api/idevelop-control/question/phone',
    method: 'get'
  })
}
// 一键转为知识
export const convert = (params) => {
  return request({
    url: '/api/idevelop-control/question/knowledge/convert',
    method: 'post',
    data: params
  })
}
