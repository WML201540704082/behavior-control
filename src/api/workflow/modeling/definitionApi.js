export const DefinitionApi={
    list: '/api/idevelop-hussar-bpm/bpm/processDefinition/queryProcessDefinitionsList',//查询列表数据
  delete: '/api/idevelop-hussar-bpm/bpm/model/deleteModelWithVersion',//版本删除
    setMain: '/api/idevelop-hussar-bpm/bpm/processDefinition/setMain',//设置主版本
    cancelMain: '/api/idevelop-hussar-bpm/bpm/processDefinition/cancelMain',//取消主版本
    downloadFiles: '/api/idevelop-hussar-bpm/bpm/model/downloadFiles' //下载XML
}
