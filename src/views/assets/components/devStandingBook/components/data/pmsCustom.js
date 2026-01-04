import checkProps from "./utils/checkProps";

export function getPropsItems(ciName, validateCallback) {
  let paramsData = [
    {
      groupName: '公共属性',
      pros: getCustomProps(ciName, validateCallback),
    }, {
      groupName: '特有属性',
      pros: getSpecialProps(ciName, validateCallback),
    }
  ];
  return paramsData;
}

//所有设备公共属性
function getCustomProps(ciName, validateCallback) {
  let customProps = [
    //必填
    {
      label: '设备分类',
      name: 'deviceCategoryCode',
      nameForCode: 'deviceCategory',
      isRequired: 1,
      allowEdit: 1,
      type: "select",
      id: '1097745625841664',
      url: '/cmdb/cicientity'
    }, {
      label: '设备类型',
      name: 'deviceTypeCode',
      nameForCode: 'deviceType',
      isRequired: 1,
      allowEdit: 1,
      type: "select",
      id: 1097745969774592,
      pid: null,
      url: '/cmdb/cicientity/pid',
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceTypeCode', callback, 'deviceType', '设备类型')
        }
      }
    }, {
      label: '制造商',
      name: 'makerCode',
      nameForCode: 'maker',
      isRequired: 1,
      allowEdit: 1,
      type: "select",
      id: 1082610161090560,
      url: '/cmdb/cicientity',
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('makerCode', callback, 'maker', '制造商')
        }
      }
    }, {
      label: '品牌',
      name: 'brandCode',
      nameForCode: 'brand',
      isRequired: 1,
      allowEdit: 0,
      type: "select",
      id: 1082554947272704,
      pid: null,
      url: '/cmdb/cicientity/pid',
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('brandCode', callback, 'brand', '品牌')
        }
      }
    }, {
      label: '系列',
      name: 'seriesCode',
      nameForCode: 'series',
      isRequired: 1,
      allowEdit: 0,
      type: "select",
      id: 1082609011851264,
      pid: null,
      url: '/cmdb/cicientity/pid',
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('seriesCode', callback, 'series', '系列')
        }
      }
    }, {
      label: '型号',
      name: 'deviceModelCode',
      nameForCode: 'deviceModel',
      isRequired: 1,
      allowEdit: 0,
      type: "select",
      id: 1082608047161344,
      pid: null,
      url: '/cmdb/cicientity/pid',
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceModelCode', callback, 'deviceModel', '型号')
        }
      }
    }, {
      label: '标准全称',
      name: 'fullName',
      isRequired: 1,
      allowEdit: 1,
      type: "text",
    }, {
      label: '设备来源',
      name: 'deviceSourceCode',
      nameForCode: 'deviceSource',
      isRequired: 1,
      allowEdit: 1,
      type: "select",
    }, {
      label: '设备状态',
      name: 'deviceStatusCode',
      nameForCode: 'deviceStatus',
      isRequired: 1,
      allowEdit: 1,
      type: "select",
    },
    {
      label: '出厂日期',
      name: 'factoryDate',
      isRequired: 1,
      allowEdit: 1,
      type: "date",
      validator: (rule, value, callback) => {
        /*出厂日期<=投运日期<=当前时间*/
        if (validateCallback) {
          validateCallback('factoryDate', callback)
        }
      }
    }, {
      label: '服务到期时间',
      name: 'serviceExpDate',
      isRequired: 1,
      allowEdit: 1,
      type: "date",
      validator: (rule, value, callback) => {
        /*出厂日期<服务到期时间*/
        if (validateCallback) {
          validateCallback('serviceExpDate', callback)
        }
      }
    }, {
      label: '投运日期',
      name: 'oprtDate',
      isRequired: 0,
      allowEdit: 1,
      type: "date",
      validator: (rule, value, callback) => {
        /*首次投运日期<=投运日期<=当前时间*/
        if (validateCallback) {
          validateCallback('oprtDate', callback)
        }
      }
    }, {
      label: '退运日期',
      name: 'retireDate',
      isRequired: 0,
      allowEdit: 1,
      type: "date",
      validator: (rule, value, callback) => {
        /*投运日期<=退运日期<=当前时间*/
        if (validateCallback) {
          validateCallback('retireDate', callback)
        }
      }
    },
    {
      label: '所属网络',
      name: 'netWorkCode',
      nameForCode: 'netWork',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    },{
      label: 'IP地址',
      name: 'IP',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      validator: (rule, value, callback) => {
        /*只允许输入数字和汉字*/
        if (value) {
          let reg = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if (reg.test(value) === false) {
            callback(new Error('IP地址格式有误'))
          } else {
            callback()
          }
        } else {
          callback('请输入IP地址')
        }
      }
    },
    {
      label: 'MAC地址',
      name: 'MAC',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      validator: (rule, value, callback) => {
        /*MAC地址校验*/
        if (value) {
          let reg = /^[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}:[A-Fa-f0-9]{1,2}$/;
          if (reg.test(value) === false) {
            callback(new Error('MAC地址格式有误（示例: FC:34:97:65:37:17）'))
          } else {
            callback()
          }
        } else {
          callback('请输入MAC地址')
        }
      }
    },
     {
      label: '安装地点',
      name: 'installationSite',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      placeholder: '请输入安装地点',
    },
    {
      label: '责任人',
      name: 'receivingPerson',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
    }, {
      label: '责任人联系方式',
      name: 'receivingTel',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      validator: (rule, value, callback) => {
        if (value) {
          if (value[0] == 1) {
            // 1 开头的默认是手机号，进行校验
            let reg = /^([1][3,4,5,6,7,8,9])\d{9}$/
            if (reg.test(value) === false) {
              callback(new Error('手机号码格式有误'))
            } else {
              callback()
            }
          } else {
            let reg = /^\d+(?:-\d+)*$/;
            if (reg.test(value) === false) {
              callback(new Error('座机号码格式有误'))
            } else {
              callback()
            }
          }
        } else {
          callback('请输入责任人联系方式')
        }
      }
    },
    {
      label: '责任人统一权限账号',
      name: 'receivePersonUnifiedAcc',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
    },
    {
      label: '责任人身份证',
      name: 'receivingIDCard',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      validator: (rule, value, callback) => {
        //身份证校验：位数、格式、年月日是否符合
        if (value) {
          if (checkProps.checkCode(value)) {
            if (checkProps.checkDate(value.substring(6, 14))) {
              if (checkProps.checkProv(value.substring(0, 2))) {
                callback();
              } else {
                callback(new Error(`身份证开头${value.substring(0, 2)}省份代码错误`));
              }
            } else {
              callback(new Error('身份证出生年月错误'));
            }
          } else {
            callback(new Error('身份证号不正确'));
          }


          // if (value.length != 18) {
          //   callback(new Error('身份证长度必须为18位'))
          // } else {
          //   let reg = /^((\d{18})|([0-9X]{18}))$/
          //   if (reg.test(value) === false) {
          //     callback(new Error('身份证必须为数字或最后一位为大写X'))
          //   } else {
          //     callback()
          //   }
          // }
        } else {
          callback(new Error('请输入责任人身份证'))
        }
      }
    },
    {
      label: '出厂序列号',
      name: 'sn',
      // isRequired: ciName == 'SG_CMAD' ? 0 : 1,
      isRequired: 1,
      allowEdit: 1,
      type: "text",
    }, {
      label: '设备增加方式',
      name: 'deviceAddTypeCode', //no
      nameForCode: 'deviceAddType',//名称
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '采购方式',
      name: 'procureTypeCode',
      nameForCode: 'procureType',
      isRequired: 1,
      allowEdit: 1,
      type: "select",
      pid: null,
    }, {
      label: 'ERP资产编码',
      name: 'assetCodeErp',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('assetCodeErp', callback)
        }
      }
    }, {
      label: '领用单位',
      name: 'receiveUnit',
      codeForName: 'receiveUnitCode',
      disabled: true,
      isRequired: 0,
      allowEdit: 1,
      type: "CORP",
    }, {
      label: '领用部门',
      name: 'receiveDept',
      codeForName: 'receiveDeptCode',
      dwcode: 'receiveUnitCode',
      isRequired: 0,
      allowEdit: 1,
      type: "DEPT",
    }, {
      label: '所在仓库',
      name: 'inWarehouseCode',
      nameForCode: 'inWarehouse',//名称
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    },
  ];
  return customProps;
}

//设备特有属性
function getSpecialProps(ciName, validateCallback) {
  let specialProps = [];
  if (ciName === 'SG_CMTD') {
    //终端设备
    specialProps = getZDSB();
  } else if (ciName === 'SG_CMHD') {
    //主机设备
    specialProps = getZJSB(validateCallback);
  } else if (ciName === 'SG_CMND') {
    //网络设备
    specialProps = getWLSB(validateCallback);
  } else if (ciName === 'SG_CMSD') {
    //存储设备
    specialProps = getCCSB(validateCallback);
  } else if (ciName === 'SG_CMAD') {
    //辅助设备
    specialProps = getFZSB(validateCallback);
  } else if (ciName === 'SG_CMFD') {
    //安全设备
    specialProps = getAQSB(validateCallback);
  } else if (ciName === 'SG_CMOD') {
    //办公设备
    specialProps = getBGSB();
  } else if (ciName === 'SG_JCSS') {
    //基础设施
    specialProps = getJCSS(validateCallback);
  }
  return specialProps;
}

//基础设施公共属性
function getJCSS(validateCallback) {
  return [
    {
      label: '空调类型',
      name: 'airConditionType',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
      // ciName: 'SG_JCSS_JFKT',//机房空调特有
      id: 1131064128241664,
      url: '/cmdb/cicientity'
    }, {
      label: '匹数',
      name: 'horsepower',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      // ciName: 'SG_JCSS_JFKT',//机房空调特有
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('horsepower', callback)
        }
      }
    }, {
      label: '制冷量(W)',
      name: 'coolCapacity',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      //ciName: 'SG_JCSS_JFKT',//机房空调特有
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('coolCapacity', callback)
        }
      }
    }, {
      label: 'UPS容量(KVA)',
      name: 'upsCapacity',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      //ciName: 'SG_JCSS_XXUPS',//信息UPS特有
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('upsCapacity', callback)
        }
      }
    }, {
      label: '电池数(块)',
      name: 'batteryNum',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      //ciName: 'SG_JCSS_XDCZ',//蓄电池组特有
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('batteryNum', callback)
        }
      }
    }, {
      label: '电池组数(组)',
      name: 'batteryPackNum',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      //ciName: 'SG_JCSS_XDCZ',//蓄电池组特有
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('batteryPackNum', callback)
        }
      }
    }, {
      label: '电源负载(VA)',
      name: 'powerLoad',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('powerLoad', callback)
        }
      }
    }, {
      label: '额定容量(A●H)',
      name: 'ratedCapacity',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('ratedCapacity', callback)
        }
      }
    }, {
      label: '电压等级',
      name: 'voltageLevelCode',
      id: '1084068218601472',
      isRequired: 0,
      allowEdit: 1,
      type: 'select',
      url: '/cmdb/cicientity'
    }, {
      label: '所属机房',
      name: 'computerRoomCode',
      nameForCode: 'computerRoom',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '所属UPS',
      name: 'belongUps',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      //ciName: 'SG_JCSS_XDCZ',//蓄电池组特有
    },
  ]
}

//办公设备特有属性
function getBGSB() {
  return [
    {
      label: '所属安全边界',
      name: 'securityBoundary',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '备品备件类型',
      name: 'sparePartsTypeId',
      nameForCode: 'sparePartsType',
      isRequired: 0,
      allowEdit: 1,
      id: 1082605773848576,
      url: '/cmdb/cicientity',
      type: "select",
    },
  ]
}

//安全设备特有属性
function getAQSB(validateCallback) {
  return [
    {
      label: '机房',
      name: 'computerRoomCode',
      nameForCode: 'computerRoom',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '机柜',
      name: 'cabinetCode',
      nameForCode: 'cabinet',
      isRequired: 0,
      allowEdit: 0,
      type: "select",
    }, {
      label: '设备起始高度(U)',
      name: 'deviceHeightBegin',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceHeightBegin', callback)
        }
      }
    }, {
      label: '设备高度(U)',
      name: 'deviceHeight',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceHeight', callback)
        }
      }
    }, {
      label: '所属安全边界',
      name: 'securityBoundary',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    },
  ]
}

//辅助设备特有属性
function getFZSB(validateCallback) {
  return [
    {
      label: '布线节点数(个)',
      name: 'wiringNodeNo',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('wiringNodeNo', callback)
        }
      }
    }, {
      label: 'UPS容量（U）',
      name: 'upsCapacity',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('upsCapacity', callback)
        }
      }
    }, {
      label: '电压等级',
      name: 'voltageLevelCode',
      id: '1084068218601472',
      isRequired: 0,
      allowEdit: 1,
      type: 'select',
      url: '/cmdb/cicientity'
    }, {
      label: 'PDU额定功率(W)',
      name: 'pduRatedPower',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('pduRatedPower', callback)
        }
      }
    }, {
      label: 'PDU运行功率(W)',
      name: 'pduOperatePower',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('pduOperatePower', callback)
        }
      }
    }, {
      label: '电源负载(VA)',
      name: 'powerLoad',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('powerLoad', callback)
        }
      }
    }, {
      label: '所属机房',
      name: 'computerRoomCode',
      nameForCode: 'computerRoom',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '机柜',
      name: 'cabinetCode',
      nameForCode: 'cabinet',
      isRequired: 0,
      allowEdit: 0,
      type: "select",
    },
    {
      label: '机柜容量',
      name: 'cabinetCapacity',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
    },
  ]
}

//存储设备特有属性
function getCCSB(validateCallback) {
  return [
    {
      label: '机房',
      name: 'computerRoomCode',
      nameForCode: 'computerRoom',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '机柜',
      name: 'cabinetCode',
      nameForCode: 'cabinet',
      isRequired: 0,
      allowEdit: 0,
      type: "select",
    }, {
      label: '设备起始高度(U)',
      name: 'deviceHeightBegin',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceHeightBegin', callback)
        }
      }
    }, {
      label: '设备高度(U)',
      name: 'deviceHeight',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceHeight', callback)
        }
      }
    }, {
      label: '所属安全边界',
      name: 'securityBoundary',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    },
  ]
}

//网络设备特有属性
function getWLSB(validateCallback) {
  return [
    {
      label: '网络设备用途类型',
      name: 'networkDeviceType',
      nameForCode: 'networkDevice',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '机房',
      name: 'computerRoomCode',
      nameForCode: 'computerRoom',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '机柜',
      name: 'cabinetCode',
      nameForCode: 'cabinet',
      isRequired: 0,
      allowEdit: 0,
      type: "select",
    }, {
      label: '设备起始高度(U)',
      name: 'deviceHeightBegin',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceHeightBegin', callback)
        }
      }
    }, {
      label: '设备高度(U)',
      name: 'deviceHeight',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceHeight', callback)
        }
      }
    }, {
      label: '主备属性',
      name: 'standbyAttr',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '所属安全边界',
      name: 'securityBoundary',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    },
  ]
}

//主机设备特有属性
function getZJSB(validateCallback) {
  return [
    {
      label: '机房',
      name: 'computerRoomCode',
      nameForCode: 'computerRoom',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '机柜',
      name: 'cabinetCode',
      nameForCode: 'cabinet',
      isRequired: 0,
      allowEdit: 0,
      type: "select",
    }, {
      label: '操作系统位数',
      name: 'OSBits',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
    }, {
      label: '设备起始高度(U)',
      name: 'deviceHeightBegin',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceHeightBegin', callback)
        }
      }
    }, {
      label: '设备高度(U)',
      name: 'deviceHeight',
      isRequired: 0,
      allowEdit: 1,
      type: "number",
      validator: (rule, value, callback) => {
        if (validateCallback) {
          validateCallback('deviceHeight', callback)
        }
      }
    }, {
      label: '主机设备用途类型',
      name: 'serverUseToType',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    }, {
      label: '所属安全边界',
      name: 'securityBoundary',
      isRequired: 0,
      allowEdit: 1,
      type: "select",
    },
  ]
}

//终端设备特有属性
function getZDSB() {
  return [
    {
      label: '使用人',
      name: 'user',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      validator: (rule, value, callback) => {
        /*只允许输入汉字*/
        if (value) {
          let reg = /^(?=.*[\u4E00-\u9FA5])[\u4E00-\u9FA5]*$/;
          if (reg.test(value) === false) {
            callback(new Error('使用人只能输入汉字'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入使用人'))
        }
      }
    }, {
      label: '使用人身份证',
      name: 'deviceUserIDCard',
      isRequired: 0,
      allowEdit: 1,
      type: "text",
      validator: (rule, value, callback) => {
        if (value) {
          if (checkProps.checkCode(value)) {
            if (checkProps.checkDate(value.substring(6, 14))) {
              if (checkProps.checkProv(value.substring(0, 2))) {
                callback();
              } else {
                callback(new Error(`身份证开头${value.substring(0, 2)}省份代码错误`));
              }
            } else {
              callback(new Error('身份证出生年月错误'));
            }
          } else {
            callback(new Error('身份证号不正确'));
          }

          // if (value.length != 18) {
          //   callback(new Error('身份证长度必须为18位'))
          // } else {
          //   let reg = /^((\d{18})|([0-9X]{18}))$/
          //   if (reg.test(value) === false) {
          //     callback(new Error('身份证必须为数字或最后一位为大写X'))
          //   } else {
          //     callback()
          //   }
          // }
        } else {
          callback(new Error('请输入责任人身份证'))
        }
      }
    },
  ]
}





