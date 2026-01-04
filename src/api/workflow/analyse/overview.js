import request from '@/router/axios'


// 获取流程信息 -- 基本的同级信息
export function getProcessMessage() {
  return request({
    url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessCountModel',
    method: 'Get'
  });
}

// 获取流程、任务7天内数据
export function getFlowTaskTrend() {
  return request({
    url: '/api/idevelop-hussar-bpm/bpm/processCount/getDayChangeCountModel',
    method: 'Get'
  });
}

// 流程状态同级数据
export function getProcessStatus() {
  return request({
    url: '/api/idevelop-hussar-bpm/bpm/processCount/queryAllProcessCountMsg',
    method: 'Get'
  });
}

// 获取各个流程的基本信息
export function getProcessAllDetails(params) {
  return request({
    url: '/api/idevelop-hussar-bpm/bpm/processCount/queryProcessInstanceDetail',
    method: 'Get',
    params
  });
}
