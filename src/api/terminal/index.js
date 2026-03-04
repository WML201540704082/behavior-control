import request from '@/router/axios';

export const getTerminalList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcterminal/list',
    method: 'get',
    params: params
  })
}

export const getTerminalDetail = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcterminal/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const addTerminal = (row) => {
    return request({
        url: '/api/idevelop-ipc/ipcterminal/save',
        method: 'post',
        data: row
    })
}

export const updateTerminal = (row) => {
    return request({
        url: '/api/idevelop-ipc/ipcterminal/update',
        method: 'post',
        data: row
    })
}
  

export const terminalRemove = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcterminal/remove',
    method: 'post',
    data: {
      id,
    }
  })
}

// 用户管理
export const getUserList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcuser/list',
    method: 'get',
    params: params
  })
}

export const getUserDetail = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcuser/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const faceUpload = (file) => {
  return request({
      url: '/api/idevelop-ipc/ipcuser/upload',
      method: 'post',
      data: file
  })
}

export const addUser = (row) => {
    return request({
        url: '/api/idevelop-ipc/ipcuser/save',
        method: 'post',
        data: row
    })
}

export const updateUser = (row) => {
    return request({
        url: '/api/idevelop-ipc/ipcuser/update',
        method: 'post',
        data: row
    })
}

export const userRemove = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcuser/remove',
    method: 'post',
    data: {
      id,
    }
  })
}

// 终端运行状态监控
export const getTerminalMonitoringList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcterminalmonitoring/list',
    method: 'get',
    params: params
  })
}

// 业务系统维护
export const getMaintenanceList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcbusinesssystem/list',
    method: 'get',
    params: params
  })
}

export const getMaintenanceDetail = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcbusinesssystem/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const addMaintenance = (row) => {
    return request({
        url: '/api/idevelop-ipc/ipcbusinesssystem/save',
        method: 'post',
        data: row
    })
}

export const updateMaintenance = (row) => {
    return request({
        url: '/api/idevelop-ipc/ipcbusinesssystem/update',
        method: 'post',
        data: row
    })
}

export const maintenanceRemove = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcbusinesssystem/remove',
    method: 'post',
    data: {
      id,
    }
  })
}

// 网络访问记录
export const getNetworkLogList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcnetworklog/list',
    method: 'get',
    params: params
  })
}

// 网络访问记录（从机）
export const getNetworkLogSlaveList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcnetworklog/list/slave',
    method: 'get',
    params: params
  })
}

// 本地应用访问记录
export const getAppLogList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipclocalapplog/list',
    method: 'get',
    params: params
  })
}

// 终端使用时长排名
export const getTerminalRank = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcterminal/terminalRank',
    method: 'get',
    params: params
  })
}

// 用户使用时长排名
export const getUserRank = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcuser/userRank',
    method: 'get',
    params: params
  })
}

// 部门使用时长排名
export const getDeptRank = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcterminalmonitoring/deptRank',
    method: 'get',
    params: params
  })
}

// 业务系统访问次数排名
export const getUrlCountRank = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcnetworklog/countRank',
    method: 'get',
    params: params
  })
}

// 桌面应用维护列表
export const getDesktopAppList = (params) => {
  return request({
    url: '/api/idevelop-ipc/ipcdesktopapp/list',
    method: 'get',
    params: params
  })
}

// 桌面应用维护详情
export const getDesktopAppDetail = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcdesktopapp/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 桌面应用维护新增
export const addDesktopApp = (data) => {
  return request({
    url: '/api/idevelop-ipc/ipcdesktopapp/save',
    method: 'post',
    data: data
  })
}
// 桌面应用维护编辑
export const updateDesktopApp = (data) => {
  return request({
      url: '/api/idevelop-ipc/ipcdesktopapp/update',
      method: 'post',
      data: data
  })
}
// 桌面应用维护删除
export const desktopAppRemove = (id) => {
  return request({
    url: '/api/idevelop-ipc/ipcdesktopapp/remove',
    method: 'post',
    data: {
      id,
    }
  })
}
