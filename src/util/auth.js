// import Cookies from 'js-cookie'
const TokenKey = 'idevelop-access-token'
const RefreshTokenKey = 'idevelop-refresh-token'

// 防重放用户会话唯一标识
const UidKey = 'idevelop-uid'
// 客户端与服务端时间差
const TimeDifferenceKey = 'idevelop-td';

// 用户首次访问系统产生的临时唯一值，用于客户端与服务端交换密钥
const KidKey = 'idevelop-kid';
// 用户首次产生访问的服务端公钥
const ServerPublicKeyBySM2Key = 'idevelop-spuk';

// 客户端生成的SM2密钥对
const ClientPublicKeyBySM2Key = 'idevelop-cpuk';
const ClientPrivateKeyBySM2Key = 'idevelop-cprk';


// 与服务端约定好的sm4的 key、iv
const Sm4Key = 'idevelop-ak';
const Sm4IvKey = 'idevelop-iv';




export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function getRefreshToken() {
  return localStorage.getItem(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return localStorage.setItem(RefreshTokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function removeRefreshToken() {
  return localStorage.removeItem(RefreshTokenKey)
}

export function getUid() {
  return localStorage.getItem(UidKey)
}

export function setUid(uid) {
  return localStorage.setItem(UidKey, uid)
}

export function removeUid() {
  return localStorage.removeItem(UidKey)
}

export function getTimeDifference() {
  return localStorage.getItem(TimeDifferenceKey)
}

export function setTimeDifference(td) {
  return localStorage.setItem(TimeDifferenceKey, td)
}

export function removeTimeDifference() {
  return localStorage.removeItem(TimeDifferenceKey)
}

export function getKidKey() {
  return localStorage.getItem(KidKey)
}

export function setKidKey(kid) {
  return localStorage.setItem(KidKey, kid)
}

export function removeKidKey() {
  return localStorage.removeItem(KidKey)
}

export function getSM4Key() {
  return localStorage.getItem(Sm4Key)
}

export function setSM4Key(sm4Key) {
  return localStorage.setItem(Sm4Key, sm4Key)
}

export function removeSM4Key() {
  return localStorage.removeItem(Sm4Key)
}

export function getSM4Iv() {
  return localStorage.getItem(Sm4IvKey)
}

export function setSM4Iv(sm4Iv) {
  return localStorage.setItem(Sm4IvKey, sm4Iv)
}

export function removeSM4Iv() {
  return localStorage.removeItem(Sm4IvKey)
}


export function getServerPubKey() {
  return localStorage.getItem(ServerPublicKeyBySM2Key)
}

export function setServerPubKey(pubKey) {
  return localStorage.setItem(ServerPublicKeyBySM2Key, pubKey)
}

export function removeServerPubKey() {
  return localStorage.removeItem(ServerPublicKeyBySM2Key)
}


export function getClientPubKey() {
  return localStorage.getItem(ClientPublicKeyBySM2Key)
}

export function setClientPubKey(pubKey) {
  return localStorage.setItem(ClientPublicKeyBySM2Key, pubKey)
}

export function removeClientPubKey() {
  return localStorage.removeItem(ClientPublicKeyBySM2Key)
}

export function getClientPriKey() {
  return localStorage.getItem(ClientPrivateKeyBySM2Key)
}

export function setClientPriKey(priKey) {
  return localStorage.setItem(ClientPrivateKeyBySM2Key, priKey)
}

export function removeClientPriKey() {
  return localStorage.removeItem(ClientPrivateKeyBySM2Key)
}

export function getDiffTime() {
  return localStorage.getItem(DiffTimeKey)
}
