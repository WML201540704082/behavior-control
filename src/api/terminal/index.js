import request from '@/router/axios';

export const getTerminalList = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcterminal/list',
    method: 'get',
    params: params
  })
}

export const getTerminalDetail = (id) => {
  return request({
    url: '/api/idevelop-plugin/ipcterminal/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const addTerminal = (row) => {
    return request({
        url: '/api/idevelop-plugin/ipcterminal/save',
        method: 'post',
        data: row
    })
}

export const updateTerminal = (row) => {
    return request({
        url: '/api/idevelop-plugin/ipcterminal/update',
        method: 'post',
        data: row
    })
}
  

export const terminalRemove = (id) => {
  return request({
    url: '/api/idevelop-plugin/ipcterminal/remove',
    method: 'post',
    data: {
      id,
    }
  })
}

// 用户管理
export const getUserList = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcuser/list',
    method: 'get',
    params: params
  })
}

export const getUserDetail = (id) => {
  return request({
    url: '/api/idevelop-plugin/ipcuser/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const faceUpload = (file) => {
  return request({
      url: '/api/idevelop-plugin/ipcuser/upload',
      method: 'post',
      data: file
  })
}

export const addUser = (row) => {
    return request({
        url: '/api/idevelop-plugin/ipcuser/save',
        method: 'post',
        data: row
    })
}

export const updateUser = (row) => {
    return request({
        url: '/api/idevelop-plugin/ipcuser/update',
        method: 'post',
        data: row
    })
}

export const userRemove = (id) => {
  return request({
    url: '/api/idevelop-plugin/ipcuser/remove',
    method: 'post',
    data: {
      id,
    }
  })
}

// 终端运行状态监控
export const getTerminalMonitoringList = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcterminalmonitoring/list',
    method: 'get',
    params: params
  })
}

// 业务系统维护
export const getMaintenanceList = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcbusinesssystem/list',
    method: 'get',
    params: params
  })
}

export const getMaintenanceDetail = (id) => {
  return request({
    url: '/api/idevelop-plugin/ipcbusinesssystem/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const addMaintenance = (row) => {
    return request({
        url: '/api/idevelop-plugin/ipcbusinesssystem/save',
        method: 'post',
        data: row
    })
}

export const updateMaintenance = (row) => {
    return request({
        url: '/api/idevelop-plugin/ipcbusinesssystem/update',
        method: 'post',
        data: row
    })
}

export const maintenanceRemove = (id) => {
  return request({
    url: '/api/idevelop-plugin/ipcbusinesssystem/remove',
    method: 'post',
    data: {
      id,
    }
  })
}

// 网络访问记录
export const getNetworkLogList = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcnetworklog/list',
    method: 'get',
    params: params
  })
}

// 网络访问记录（从机）
export const getNetworkLogSlaveList = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcnetworklog/list/slave',
    method: 'get',
    params: params
  })
}

// 本地应用访问记录
export const getAppLogList = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipclocalapplog/list',
    method: 'get',
    params: params
  })
}

// 终端使用时长排名
export const getTerminalRank = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcterminal/terminalRank',
    method: 'get',
    params: params
  })
}

// 用户使用时长排名
export const getUserRank = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcuser/userRank',
    method: 'get',
    params: params
  })
}

// 部门使用时长排名
export const getDeptRank = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcterminalmonitoring/deptRank',
    method: 'get',
    params: params
  })
}

// 业务系统访问次数排名
export const getUrlCountRank = (params) => {
  return request({
    url: '/api/idevelop-plugin/ipcnetworklog/countRank',
    method: 'get',
    params: params
  })
}

// 消息管理
export const getMessageList = (params) => {
  return request({
    url: '/api/idevelop-plugin/message/list',
    method: 'get',
    params: params
  })
}

// 桌面应用维护详情
export const messageDetail = (id) => {
  return request({
    url: '/api/idevelop-plugin/message/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 消息新增
export const addMessage = (data) => {
  return request({
    url: '/api/idevelop-plugin/message/save',
    method: 'post',
    data: data
  })
}
// 消息编辑
export const updateMessage = (data) => {
  return request({
      url: '/api/idevelop-plugin/ipcdesktmessageopapp/update',
      method: 'post',
      data: data
  })
}
// 消息删除
export const messageRemove = (id) => {
  return request({
    url: '/api/idevelop-plugin/message/remove',
    method: 'post',
    data: {
      id,
    }
  })
}
