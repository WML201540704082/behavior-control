// import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import smCrypto from 'sm-crypto'
import { getSM4Key, getSM4Iv} from '@/util/auth'
import {SM4} from "gm-crypto";


// // 加密
// export function encrypt(txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPublicKey(publicKey) // 设置公钥
//   return encryptor.encrypt(txt) // 对需要加密的数据进行加密
// }

// // 解密
// export function decrypt(txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPrivateKey(privateKey)
//   return encryptor.decrypt(txt)
// }

// // rsa加密
// export function encryptByKey(pubKey, txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPublicKey(pubKey) // 设置公钥
//   return encryptor.encrypt(txt) // 对需要加密的数据进行加密
// }

//使用sm2加密
export function sm2EncryptByKey(pubKey, txt) {
  const sm2 = smCrypto.sm2;
  return sm2.doEncrypt(txt,pubKey,1)
}

// SM2非对称国密加密
export function encryptBySM2(text, pubKey) {
  const sm2 = smCrypto.sm2
  let enContent = sm2.doEncrypt(text, pubKey, 1)
  return enContent;
}

// SM2非对称国密解密密
export function decryptBySM2(text, priKey) {
  const sm2 = smCrypto.sm2
  let deContent = sm2.doDecrypt(text, priKey, 1)
  return deContent;
}

export function createSM2Key() {
  let sm2 = smCrypto.sm2
  let keypari = sm2.generateKeyPairHex()
  return keypari;
}


// SM3hash签名算法
export function sm3Hash(text) {
  const sm3 = smCrypto.sm3
  return sm3(text);
}

// SM4对称国密加密
export function encryptBySM4(text) {
  const sm4 = smCrypto.sm4;
  let enContent = sm4.encrypt(text, getSM4Key());
  return enContent;
}

// SM4对称国密解密
export function decryptBySM4(text) {
  const sm4 = smCrypto.sm4;
  let deContent = sm4.decrypt(text, getSM4Key());
  return deContent;
}

export function decryptBySM4CBC(text) {
  const key = getSM4Key();
  const iv = getSM4Iv();
  return SM4.decrypt(text, key, {
    iv: iv,
    mode: SM4.constants.CBC,
    inputEncoding: 'hex',
    outputEncoding: 'utf8'
  });
}

export function encryptBySM4CBC(text) {
  const key = getSM4Key();
  const iv = getSM4Iv();

  return SM4.encrypt(text, key, {
    iv: iv,
    mode: SM4.constants.CBC,
    inputEncoding: 'utf8',
    outputEncoding: 'hex'
  })
}
