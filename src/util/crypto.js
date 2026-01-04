import CryptoJS from 'crypto-js';
import smCrypto from 'sm-crypto'
import {SM4} from 'gm-crypto'
import {getSM4Key,getSM4Iv} from './auth'
export default class crypto {
  // 使用AesUtil.genAesKey()生成,需和后端配置保持一致
  static aesKey = '';

  // 使用DesUtil.genDesKey()生成,需和后端配置保持一致
  static desKey = '';

  /**
   * aes 加密方法
   * @param data
   * @returns {*}
   */
  static encrypt(data) {
    return this.encryptAES(data, this.aesKey);
  }

  /**
   * aes 解密方法
   * @param data
   * @returns {*}
   */
  static decrypt(data) {
    return this.decryptAES(data, this.aesKey);
  }

  /**
   * aes 加密方法，同java：AesUtil.encryptToBase64(text, aesKey);
   */
  static encryptAES(data, key) {
    const dataBytes = CryptoJS.enc.Utf8.parse(data);
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(dataBytes, keyBytes, {
      iv: keyBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  /**
   * aes 解密方法，同java：AesUtil.decryptFormBase64ToString(encrypt, aesKey);
   */
  static decryptAES(data, key) {
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt(data, keyBytes, {
      iv: keyBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  }

  /**
   * des 加密方法，同java：DesUtil.encryptToBase64(text, desKey)
   */
  static encryptDES(data, key) {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.DES.encrypt(data, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  /**
   * des 解密方法，同java：DesUtil.decryptFormBase64(encryptBase64, desKey);
   */
  static decryptDES(data, key) {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(data),
      },
      keyHex,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * 国密SM2非对称国密加密
   * @param data 明文
   * @param puk 公钥
   * @returns {*} 密文
   */
  static encryptBySM2(data, puk) {
    const sm2 = smCrypto.sm2;
    return sm2.doEncrypt(data, puk, 1)
  }

  /**
   * 国密SM2非对称国密解密
   * @param data 密文
   * @param prk 私钥
   * @returns {string | undefined | []} 明文
   */
  static decryptBySM2(data, prk) {
    const sm2 = smCrypto.sm2;
    return sm2.doDecrypt(data, prk, 1);
  }

  /**
   * 国密SM3-hash签名算法
   * @param data
   */
  static hashBySM3(data) {
    const sm3 = smCrypto.sm3;
    return sm3(data);
  }

  /**
   * 国密SM4对称加密
   * key由服务端生成
   * @param data
   * @returns {string | []} 密文
   */
  static encryptBySM4(data) {
    const sm4 = smCrypto.sm4;
    return sm4.encrypt(data, getSM4Key());
  }

  // SM4对称国密解密
  static decryptBySM4(data) {
    const sm4 = smCrypto.sm4;
    return sm4.decrypt(data, getSM4Key());
  }

  // 获取SM2密钥对
  static createSM2Key() {
    let sm2 = smCrypto.sm2
    let keypari = sm2.generateKeyPairHex()
    return keypari;
  }


  static decryptBySM4CBC(text) {
    const key = getSM4Key();
    const iv = getSM4Iv();
    return SM4.decrypt(text, key, {
      iv: iv,
      mode: SM4.constants.CBC,
      inputEncoding: 'hex',
      outputEncoding: 'utf8'
    });
  }

  static encryptBySM4CBC(text) {
    const key = getSM4Key();
    const iv = getSM4Iv();

    return SM4.encrypt(text, key, {
      iv: iv,
      mode: SM4.constants.CBC,
      inputEncoding: 'utf8',
      outputEncoding: 'hex'
    })
  }


}



