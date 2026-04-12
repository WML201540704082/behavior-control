// 表单验证公共方法

// 唯一标识校验
const validateNameId = (rule, value, callBack) => {
  const nameReg = new RegExp(/^[a-zA-Z_][a-zA-Z0-9_\.]*$/)
  // console.log(nameReg.test(value))
  
  if(!nameReg.test(value)) {
    return callBack(new Error('变量名只能以字母、数字、下划线和.组成，且开头不能是数字'))
  }else {
    callBack()
  }
}

export default {
  common: {
    nameCheck: [ //唯一标识校验
      { required: true, message: '唯一标识不能为空', trigger: 'blur' },
      {
        validator: validateNameId,
        trigger: 'blur'
      }
    ]
  }
}