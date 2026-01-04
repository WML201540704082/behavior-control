import request from '@/router/axios'

// 服务器总数量统计
export function getServerTotal() {
  return request({
    url: '/msdp-device/serverinfo/total',
    method: 'get',
  })
}

// 服务器在线状态数量统计
export function getServerOnlineCount() {
  return request({
    url: '/msdp-device/serverinfo/onlineCount',
    method: 'get',
  })
}

// 服务器生产商数量统计
export function getManufactureCount() {
  return request({
    url: '/msdp-device/serverinfo/manufactureCount',
    method: 'get',
  })
}

// 服务器系统类型数量统计
export function getOsTypeCount() {
  return request({
    url: '/msdp-device/serverinfo/osTypeCount',
    method: 'get',
  })
}

// 服务器数据库数量统计
export function getDbCount() {
  return request({
    url: '/msdp-device/serverinfo/dbCount',
    method: 'get',
  })
}

// 终端设备总数统计
export function getDeviceClass() {
  return request({
    url: '/msdp-device/deviceCount/getDeviceClass',
    method: 'get',
  })
}

// 设备台账总数统计
export function getDevTotal() {
  return request({
    url: '/msdp-device/deviceCount/getHardwareBasic',
    method: 'get',
  })
}

// 在运设备数统计
export function getNetworkTotal() {
  return request({
    url: '/msdp-device/deviceCount/getHardwareNetwork',
    method: 'get',
  })
}

// 当日认证成功总数
export function getOfflineTotal() {
  return request({
    url: '/msdp-device/deviceCount/getOffline',
    method: 'get',
  })
}

// 僵尸设备总数
export function getHsTotal() {
  return request({
    url: '/msdp-device/deviceCount/getOffline',
    method: 'get',
  })
}

// 告警总数
export function getWarningTotal() {
  return request({
    url: '/msdp-device/deviceCount/getWarningCount',
    method: 'get',
  })
}

// 办公终端在线状态统计
export function getLineCount() {
  return request({
    url: '/msdp-device/deviceCount/getLineCount',
    method: 'get',
  })
}

// 办公终端操作系统
export function getClientCount() {
  return request({
    url: '/msdp-device/deviceCount/getClientCount',
    method: 'get',
  })
}

// 网络设备厂商统计
export function getBrandCount() {
  return request({
    url: '/msdp-device/deviceCount/getBrandCount',
    method: 'get',
  })
}

// 网络设备在线状态统计总数
export function getInterfaceTotal() {
  return request({
    url: '/msdp-device/deviceCount/getNumCount',
    method: 'get',
  })
}
// 网络设备在线状态统计（在线数）
export function getInterfaceCount() {
  return request({
    url: '/msdp-device/deviceCount/getInterfaceCount',
    method: 'get',
  })
}

// 办公终端活跃度
export function getTimeCount() {
  return request({
    url: '/msdp-device/deviceCount/getTimeCount',
    method: 'get',
  })
}

// 办公终端在线匹配度
export function getMatchCount() {
  return request({
    url: '/msdp-device/deviceCount/getWorkOnline',
    method: 'get',
  })
}

// 安全设备总数
export function getSecurity() {
  return request({
    url: '/msdp-device/deviceCount/getSecurity',
    method: 'get',
  })
}

// 网络设备总数
export function getNetWork() {
  return request({
    url: '/msdp-device/deviceCount/getNetWork',
    method: 'get',
  })
}

// 八大分类总数占比
export function getClassIfCation() {
  return request({
    url: '/msdp-device/deviceCount/getClassIfCation',
    method: 'get',
  })
}

// 八大分类终端告警
export function getWarningRuleCount() {
  return request({
    url: '/msdp-device/deviceCount/getWarningRuleCount',
    method: 'get',
  })
}

// 八大类在线数
export function getClassIfOnlineCount() {
  return request({
    url: '/msdp-device/deviceCount/getClassIfOnlineCount',
    method: 'get',
  })
}

// 网络设备匹配度
export function getMatch() {
  return request({
    url: '/msdp-device/deviceCount/getMatch',
    method: 'get',
  })
}
