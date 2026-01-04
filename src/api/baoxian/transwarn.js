import request from '@/router/axios';

//Count统计数
export const Count = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/count',
    method: 'get',
    params: {
      ...params
    }
  })
}

//告警预览-异动告警数-按钮
export const topLeftBtn1 = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/seven/count',
    method: 'get',
    params: {
      ...params
    }
  })
}

//告警预览-告警等级分布-按钮
export const topLeftBtn2 = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/level/count',
    method: 'get',
    params: {
      ...params
    }
  })
}

//告警预览-告警的类型分布-按钮
export const topLeftBtn3 = (regionCode) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/type/count',
    method: 'get',
    params: {regionCode}
  })
}

//告警预览-告警城市分布-按钮
export const topLeftBtn4 = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/city/count',
    method: 'get',
    params: {
      ...params
    }
  })
}


//告警处置概览-未确认告警-按钮
export const topRightBtn1 = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/confirm/count',
    method: 'get',
    params: {
      ...params
    }
  })
}
//告警处置概览-已忽略告警-按钮
export const topRightBtn2 = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/ignore/count',
    method: 'get',
    params: {
      ...params
    }
  })
}

//告警处置概览-已确认待处置-按钮
export const topRightBtn3 = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/dispose/count',
    method: 'get',
    params: {
      ...params
    }
  })
}

//未处置告警情况-左下数据
export const downLeft = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/dispose/schedule',
    method: 'get',
    params: {
      ...params
    }
  })
}

//今日新增告警-右下数据
export const downRightDay = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/day/count',
    method: 'get',
    params: {
      ...params
    }
  })
}
//本周告警数-右下数据
export const downRightWeek = (params) => {
  return request({
    url: '/api/idevelop-data/warning/statistics/week/count',
    method: 'get',
    params: {
      ...params
    }
  })
}
